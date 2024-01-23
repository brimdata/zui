import fs from "fs"
import {Loader} from "src/core/loader/types"
import {LoadContext} from "src/domain/loads/load-context"
import {isPcap} from "./packets/is-pcap"
import {loads} from "src/zui"
import {pipeline} from "stream"
import {createTransform} from "./transform-stream"
import {configureZeekPool} from "./configure-zeek-pool"
import {createAnalyzeProcess, monitorAnalyzeProgress} from "./analyze"
import {createCli} from "./cli"
import errors from "src/js/errors"
import {errorToString} from "src/util/error-to-string"

class BrimcapLoader implements Loader {
  constructor(private ctx: LoadContext, private root: string) {}

  async when() {
    const file = this.ctx.files[0]
    return file && (await isPcap(file))
  }

  async run() {
    if (this.ctx.files.length > 1) {
      throw new Error("Only one PCAP can be loaded at a time")
    }
    this.ctx.setProgress(0)
    await this.load(this.startPipeline())
    this.index()
    configureZeekPool(this.ctx.poolId)
    this.ctx.setProgress(1)
  }

  startPipeline() {
    return pipeline(fs.createReadStream(this.pcap), this.analyze(), (err) => {
      if (err) {
        this.ctx.abort()
        this.ctx.addError(errorToString(err))
      }
    })
  }

  analyze() {
    const process = createAnalyzeProcess(this.ctx.signal)
    const stream = createTransform(process)
    const totalSize = fs.statSync(this.pcap).size
    monitorAnalyzeProgress(process, ({type, ...status}) => {
      switch (type) {
        case "status":
          this.ctx.setProgress(status.pcap_read_size / totalSize || 0)
          this.ctx.onPoolChanged()
          break
        case "warning":
          if (status.warning) this.ctx.addError(status.warning)
          break
        case "error":
          if (status.error) stream.destroy(new Error(status.error))
          break
      }
    })
    return stream
  }

  index() {
    const cli = createCli()
    try {
      cli.index({root: this.root, pcap: this.pcap})
    } catch (e) {
      console.error(e)
      throw errors.pcapIngest(e)
    }
  }

  async load(streamBody: NodeJS.ReadableStream) {
    const client = await this.ctx.createClient()
    const {ctx} = this
    const author = "zui"
    const body = "Automatic Import with brimcap analyze"
    const pool = ctx.poolId
    const {branch, signal} = ctx
    return client.load(streamBody, {
      message: {author, body},
      pool,
      branch,
      signal,
    })
  }

  get pcap() {
    return this.ctx.files[0]
  }
}

export function activateBrimcapLoader(root: string) {
  loads.addLoader("brimcap-loader", (ctx: LoadContext) => {
    return new BrimcapLoader(ctx, root)
  })
}
