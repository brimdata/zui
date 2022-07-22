import {zed} from "@brimdata/zealot"
import env from "src/app/core/env"
import {ChildProcess, spawn} from "child_process"
import {MenuItemConstructorOptions} from "electron"
import fsExtra, {pathExistsSync} from "fs-extra"
import {compact} from "lodash"
import path, {join} from "path"
import errors from "src/js/errors"
import BrimApi from "src/js/api"
import {IngestParams} from "src/js/brim/ingest/getParams"
import open from "src/js/lib/open"
import {toNodeReadable} from "src/js/lib/response"
import {Config} from "src/js/state/Configs"
import BrimcapCLI, {analyzeOptions, searchOptions} from "./brimcap-cli"
import {findConnLog} from "../zui-zeek/queries"
import {findUid} from "../zui-zeek/util"

export default class BrimcapPlugin {
  private pluginNamespace = "brimcap"
  private yamlConfigPropName = "yamlConfigPath"
  private cli: BrimcapCLI
  // currentConn represents the data detail currently seen in the Brim detail
  // pane/window
  private currentConn = null
  // selectedConn represents the data detail currently selected and highlighted
  // in the search viewer
  private selectedConn = null
  private yamlConfigPath = ""
  private cleanupFns: Function[] = []
  private processes: {
    [pid: number]: ChildProcess
  } = {}
  private brimcapDataRoot = ""
  private brimcapBinPath = ""
  private suricataUserDir = ""
  private toastConfig = {
    loading: {
      // setTimeout's maximum value is a 32-bit int, so we explicitly specify here
      // also, once https://github.com/timolins/react-hot-toast/pull/37 merges, we can set this to -1
      duration: 2 ** 31 - 1,
    },
    success: {
      duration: 3000,
    },
    error: {
      duration: 5000,
    },
  }

  constructor(private api: BrimApi) {
    // RFC: what interface do we want the app to provide for this sort of data?
    const dataRoot = api.getPath("app-data")
    const zdepsDirectory = api.getPath("zdeps")

    const commandName = env.isWindows ? "brimcap.exe" : "brimcap"
    this.brimcapBinPath = path.join(zdepsDirectory, commandName)
    this.cli = new BrimcapCLI(this.brimcapBinPath)

    this.brimcapDataRoot = path.join(dataRoot, "brimcap-root")
    this.suricataUserDir = path.join(dataRoot, "suricata")
  }

  init() {
    fsExtra.ensureDirSync(this.brimcapDataRoot)

    if (!pathExistsSync(this.brimcapBinPath)) {
      console.error(
        new Error(
          `Packaging error: brimcap executable could not be found at '${this.brimcapBinPath}', please submit an issue at https://github.com/brimdata/brim/issues/new/choose for assistance`
        )
      )
      return
    }

    this.setupBrimcapButtons()
    this.setupLoader()
    this.setupConfig()
    this.setupContextMenus()

    // suricataupdater and suricatarunner (run by "brimcap analyze")
    // both consult BRIM_SURICATA_USER_DIR.
    process.env.BRIM_SURICATA_USER_DIR = this.suricataUserDir
    // NOTE: suricata updates async, don't block
    this.updateSuricata()
  }

  private async tryConn(detail: zed.Record, queryId: string) {
    const uid = findUid(detail)
    const pool = this.api.current.poolName
    const res = await this.api.query(findConnLog(pool, uid), {
      id: `brimcap/try-conn-${queryId}`,
    })
    const [conn] = await res.zed()
    return conn as zed.Record | null
  }

  private setupBrimcapButtons() {
    const searchButtonId = "wireshark-button:search"
    const detailButtonId = "wireshark-button:detail"
    const brimcapDownloadSelectedCmd = "brimcap-download-packets:selected"
    const brimcapDownloadCurrentCmd = "brimcap-download-packets:current"

    const itemOptions = {
      label: "Packets",
      icon: "sharkfin", // TODO: enable plugins to provide their own assets
      disabled: true,
      tooltip: "No connection record found.",
      order: 0,
    }

    const setButtonDetails = (
      toolbarId: string,
      buttonId: string,
      isDisabled: boolean
    ) => {
      this.api.toolbar.update(toolbarId, buttonId, {
        disabled: isDisabled,
        tooltip: isDisabled
          ? "No connection record found."
          : "Open packets from this connection.",
      })
    }

    const updateButtonStatus = (
      toolbarId: string,
      buttonId: string,
      data: zed.Record,
      setConn: (conn: zed.Record) => {}
    ) => {
      if (!data) {
        setButtonDetails(toolbarId, buttonId, true)
        return
      }
      this.tryConn(data, buttonId)
        .then((conn) => {
          setConn(conn)
          setButtonDetails(toolbarId, buttonId, !conn)
        })
        .catch((err) => {
          if (!env.isTest) console.error(err)
          setConn(null)
          setButtonDetails(toolbarId, buttonId, true)
        })
    }

    // add brimcap buttons to search and detail toolbars
    this.api.toolbar.add("search", {
      ...itemOptions,
      id: searchButtonId,
      command: brimcapDownloadSelectedCmd,
    })
    this.api.toolbar.add("detail", {
      ...itemOptions,
      id: detailButtonId,
      command: brimcapDownloadCurrentCmd,
      label: undefined,
    })

    // add click handlers for button's emitted commands
    this.cleanupFns.push(
      this.api.commands.add(brimcapDownloadSelectedCmd, () => {
        this.selectedConn && this.downloadPcap(this.selectedConn)
      }),
      this.api.commands.add(
        brimcapDownloadCurrentCmd,
        () => this.currentConn && this.downloadPcap(this.currentConn)
      )
    )

    // add brim-command listeners to update button statuses
    this.cleanupFns.push(
      // the detail window's packets button will operate off of the 'current' record
      this.api.commands.add("data-detail:current", ([record]) => {
        if (!record) return
        const data = record as zed.Record

        updateButtonStatus(
          "detail",
          detailButtonId,
          data,
          (conn) => (this.currentConn = conn)
        )
      }),
      // the search window's packets button operates off of the 'selected' record
      // (whatever is highlighted in the viewer/table)
      this.api.commands.add("data-detail:selected", ([data]) => {
        updateButtonStatus(
          "search",
          searchButtonId,
          data,
          (conn) => (this.selectedConn = conn)
        )
      })
    )
  }

  private setupContextMenus() {
    const itemBuilder = (data: {
      record: zed.Record
      field: zed.Field
    }): MenuItemConstructorOptions => {
      const {record} = data
      const isConn = record.try("_path")?.toString() === "conn"

      return {
        click: () => {
          this.downloadPcap(record)
        },
        enabled: isConn,
        label: "Download packets",
      }
    }

    this.api.contextMenus.search.add(itemBuilder)
    this.api.contextMenus.detail.add(itemBuilder)
  }

  private logToSearchOpts(log: zed.Record): searchOptions {
    const ts = log.get("ts") as zed.Time

    const tsString = ts.toString()
    const dur = log.try("duration") as zed.Duration
    const dest = join(
      this.api.getPath("temp"),
      `packets-${tsString}.pcap`.replace(/:/g, "_")
    )

    return {
      dstIp: log.get(["id", "resp_h"]).toString(),
      dstPort: log.get(["id", "resp_p"]).toString(),
      duration: dur?.isSet() ? dur.toString() : "0s",
      proto: log.get("proto").toString(),
      root: this.brimcapDataRoot,
      srcIp: log.get(["id", "orig_h"]).toString(),
      srcPort: log.get(["id", "orig_p"]).toString(),
      ts: tsString,
      write: dest,
    }
  }

  private async downloadPcap(log: zed.Record) {
    let searchOpts
    try {
      searchOpts = this.logToSearchOpts(log)
    } catch (e) {
      console.error(e)
      this.api.toast.error(
        "Flow's 5-tuple and/or time span was not found in the connection record"
      )
      return
    }

    const searchAndOpen = async () => {
      const res = await this.cli.search(searchOpts)
      if (res.status > 0) {
        const err = res.stderr.toString()
        const msg = JSON.parse(err)?.error || `brimcap search failed: ${err}`

        throw new Error(msg)
      }

      return await open(searchOpts.write, {newWindow: true})
    }

    this.api.toast.promise(
      searchAndOpen(),
      {
        loading: "Preparing pcap...",
        success: "Preparation complete",
        error: (err) => {
          console.error(err)
          return "Error preparing pcap: " + err.message
        },
      },
      this.toastConfig
    )
  }

  private setupLoader() {
    const load = async (
      params: IngestParams & {poolId: string; branch: string},
      onProgressUpdate: (value: number) => void,
      onWarning: (warning: string) => void,
      onDetailUpdate: () => void,
      signal?: AbortSignal
    ): Promise<void> => {
      const {fileListData} = params
      if (fileListData.length > 1)
        throw new Error("Only one pcap can be opened at a time.")

      const cliOpts: analyzeOptions = {
        json: true,
      }
      const yamlConfig = this.api.configs.get(
        this.pluginNamespace,
        this.yamlConfigPropName
      )
      cliOpts.config = yamlConfig || ""

      const pcapPath = fileListData[0].file.path
      const pcapTotalSize = fileListData[0].file.size
      const pcapStream = toNodeReadable(
        fileListData[0].file.stream().getReader()
      )

      onProgressUpdate(0)
      const analyzeP = this.cli.analyze("-", cliOpts, signal)
      this.processes[analyzeP.pid] = analyzeP
      pcapStream.pipe(analyzeP.stdin)

      analyzeP.on("close", () => {
        delete this.processes[analyzeP.pid]
      })
      let analyzeErr
      analyzeP.on("error", (err) => {
        analyzeErr = err
      })

      const handleRespMsg = async (jsonMsg) => {
        const {type, ...status} = jsonMsg
        switch (type) {
          case "status":
            onProgressUpdate(statusToPercent(status, pcapTotalSize))
            await onDetailUpdate()
            break
          case "warning":
            if (status.warning) onWarning(status.warning)
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
        delete this.processes[analyzeP.pid]
      })

      // stream analyze output to pool
      const zealot = await this.api.getZealot()
      try {
        await zealot.load(analyzeP.stdout, {
          pool: params.poolId,
          branch: params.branch,
          message: {
            author: "brim",
            body: "automatic import with brimcap analyze",
          },
          signal,
        })
      } catch (e) {
        // if load failed because analyze did, report the analyzeErr
        if (analyzeErr) throw errors.pcapIngest(analyzeErr)
        // otherwise report the loadErr
        throw errors.pcapIngest(e)
      }

      // generate pcap index
      // in tests we may not have the pcapPath, so skip indexing for now
      if (pcapPath) {
        try {
          this.cli.index({
            root: this.brimcapDataRoot,
            pcap: pcapPath,
          })
        } catch (e) {
          console.error(e)
          throw errors.pcapIngest(e)
        }
      }

      await onDetailUpdate()
      onProgressUpdate(1)
    }

    this.api.loaders.add({
      load,
      match: "pcap",
    })
  }

  private setupConfig() {
    const brimcapConfig: Config = {
      name: this.pluginNamespace,
      title: "Brimcap Settings",
      properties: {
        [this.yamlConfigPropName]: {
          name: this.yamlConfigPropName,
          type: "file",
          label: "Brimcap YAML Config File",
          defaultValue: "",
          helpLink: {
            label: "docs",
            url: "https://github.com/brimdata/brimcap/wiki/Custom-Brimcap-Config",
          },
        },
      },
    }

    this.api.configs.add(brimcapConfig)
  }

  private async updateSuricata() {
    /* To get better coverage we can mock the spawn call */
    if (env.isTest) return
    const zdepsDirectory = this.api.getPath("zdeps")
    const cmdName = env.isWindows ? "suricataupdater.exe" : "suricataupdater"
    const cmdPath = path.join(zdepsDirectory, "suricata", cmdName)
    const proc = spawn(cmdPath)
    this.processes[proc.pid] = proc

    let err
    proc.on("error", (e) => (err = e))

    await new Promise<void>((res) =>
      proc.on("close", () => {
        delete this.processes[proc.pid]
        res()
      })
    )

    if (err)
      throw new Error(`Error updating Suricata rules: ${err.message || err}`)
  }

  async cleanup() {
    await Promise.all(
      Object.values(this.processes).map((p: ChildProcess) => {
        return new Promise<void>((res) => {
          if (p.killed) {
            delete this.processes[p.pid]
            res()
            return
          }

          p.on("exit", () => {
            delete this.processes[p.pid]
            res()
          })
          p.kill()
        })
      })
    )
  }
}

// helpers
function statusToPercent(status, totalSize): number {
  return status.pcap_read_size / totalSize || 0
}
