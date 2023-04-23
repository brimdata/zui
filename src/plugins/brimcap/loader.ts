import {AnalyzeOptions} from "./brimcap-cli"
import fs from "fs"
import {compact} from "lodash"
import errors from "src/js/errors"
import {pluginNamespace, yamlConfigPropName} from "./config"
import {createCli} from "./create-cli"
import {ChildProcess} from "child_process"
import {Loader} from "src/core/loader/types"
import {LoadContext} from "src/core/loader/load-context"
import {isPcap} from "./is-pcap"

export function createLoader(root: string): Loader {
  const processes: Record<number, ChildProcess> = {}

  async function when(ctx: LoadContext): Promise<boolean> {
    const file = ctx.files[0]
    return file && (await isPcap(file))
  }
  async function run(ctx: LoadContext) {
    if (ctx.files.length > 1) {
      throw new Error("Only one PCAP can be loaded at a time")
    }

    const main = ctx.main
    const cliOpts: AnalyzeOptions = {json: true}
    const yamlConfig = main.configs.get(pluginNamespace, yamlConfigPropName)
    cliOpts.config = yamlConfig || ""
    const pcap = ctx.files[0]
    const pcapTotalSize = fs.statSync(pcap).size
    const pcapStream = fs.createReadStream(pcap)

    ctx.onProgress(0)
    const cli = createCli()
    const analyzeP = cli.analyze("-", cliOpts, ctx.signal)
    processes[analyzeP.pid] = analyzeP
    pcapStream.pipe(analyzeP.stdin)

    analyzeP.on("close", () => {
      delete processes[analyzeP.pid]
    })
    let analyzeErr
    analyzeP.on("error", (err) => {
      analyzeErr = err
    })

    const handleRespMsg = async (jsonMsg) => {
      const {type, ...status} = jsonMsg
      switch (type) {
        case "status":
          ctx.onProgress(statusToPercent(status, pcapTotalSize))
          await ctx.onPoolChanged()
          break
        case "warning":
          if (status.warning) ctx.onWarning(status.warning)
          break
        case "error":
          if (status.error) analyzeErr = status.error
          break
      }
    }

    // on first data, emit a 'start' on stdout so zealot knows not to timeout the request
    analyzeP.stderr.once("data", () => analyzeP.stdout.emit("start"))
    analyzeP.stderr.on("data", (d) => {
      try {
        const msgs: string[] = compact(d.toString().split("\n"))
        const jsonMsgs = msgs.map((msg) => JSON.parse(msg))
        jsonMsgs.forEach(handleRespMsg)
      } catch (e) {
        console.error(e)
        analyzeErr = d.toString()
      }
    })
    analyzeP.on("close", () => {
      delete processes[analyzeP.pid]
    })

    // stream analyze output to pool
    const client = await main.createClient(ctx.lakeId)
    try {
      await client.load(analyzeP.stdout, {
        pool: ctx.poolId,
        branch: ctx.branch,
        message: {
          author: "zui",
          body: "automatic import with brimcap analyze",
        },
        signal: ctx.signal,
      })
    } catch (e) {
      if (analyzeErr)
        // if load failed because analyze did, report the analyzeErr
        throw errors.pcapIngest(analyzeErr)
      // otherwise report the loadErr
      throw errors.pcapIngest(e)
    }

    // generate pcap index
    // in tests we may not have the pcapPath, so skip indexing for now
    if (pcap) {
      try {
        cli.index({root, pcap})
      } catch (e) {
        console.error(e)
        throw errors.pcapIngest(e)
      }
    }

    await ctx.onPoolChanged()
    ctx.onProgress(1)
  }

  function rollback() {}

  return {when, run, rollback}
}

// helpers
function statusToPercent(status, totalSize): number {
  return status.pcap_read_size / totalSize || 0
}
