export {}
// import * as zed from "@brimdata/zed-js"
// import env from "src/app/core/env"
// import {ChildProcess, spawn} from "child_process"
// import {MenuItemConstructorOptions} from "electron"
// import fsExtra, {pathExistsSync} from "fs-extra"
// import {compact} from "lodash"
// import path, {join} from "path"
// import errors from "src/js/errors"
// import {IngestParams} from "src/js/models/ingest/getParams"
// import open from "src/js/lib/open"
// import {toNodeReadable} from "src/js/lib/response"
// import BrimcapCLI, {analyzeOptions, searchOptions} from "./brimcap-cli"
// import {findConnLog} from "../zui-zeek/queries"
// import {findUid} from "../zui-zeek/util"
// import {ZuiMain} from "src/js/electron/zui-main"
// import {pluginNamespace, yamlConfigPropName} from "./config"
//
// export default class BrimcapPlugin {
//   private cli: BrimcapCLI
//   // currentConn represents the data detail currently seen in the Zui detail
//   // pane/window
//   private currentConn = null
//   private yamlConfigPath = ""
//   private cleanupFns: Function[] = []
//   private processes: {
//     [pid: number]: ChildProcess
//   } = {}
//   private brimcapDataRoot = ""
//   public brimcapBinPath = ""
//   private suricataUserDir = ""
//   private toastConfig = {
//     loading: {
//       // setTimeout's maximum value is a 32-bit int, so we explicitly specify here
//       // also, once https://github.com/timolins/react-hot-toast/pull/37 merges, we can set this to -1
//       duration: 2 ** 31 - 1,
//     },
//     success: {
//       duration: 3000,
//     },
//     error: {
//       duration: 5000,
//     },
//   }
//
//   constructor(private api: ZuiMain) {
//     // RFC: what interface do we want the app to provide for this sort of data?
//     const dataRoot = api.getPath("app-data")
//     const zdepsDirectory = api.getPath("zdeps")
//
//     const commandName = env.isWindows ? "brimcap.exe" : "brimcap"
//     this.brimcapBinPath = path.join(zdepsDirectory, commandName)
//     this.cli = new BrimcapCLI(this.brimcapBinPath)
//
//     this.brimcapDataRoot = path.join(dataRoot, "brimcap-root")
//     this.suricataUserDir = path.join(dataRoot, "suricata")
//   }
//
//   init() {
//     fsExtra.ensureDirSync(this.brimcapDataRoot)
//
//     if (!pathExistsSync(this.brimcapBinPath)) {
//       console.error(
//         new Error(
//           `Packaging error: brimcap executable could not be found at '${this.brimcapBinPath}', please submit an issue at https://github.com/brimdata/zui/issues/new/choose for assistance`
//         )
//       )
//       return
//     }
//
//     this.setupBrimcapButtons()
//     this.setupLoader()
//     this.setupConfig()
//     this.setupContextMenus()
//
//     // suricataupdater and suricatarunner (run by "brimcap analyze")
//     // both consult BRIM_SURICATA_USER_DIR.
//     process.env.BRIM_SURICATA_USER_DIR = this.suricataUserDir
//     // NOTE: suricata updates async, don't block
//     this.updateSuricata()
//   }
//
//   private async tryConn(detail: zed.Record, queryId: string) {
//     const uid = findUid(detail)
//     const pool = this.api.current.poolName
//     if (!pool || !uid) return null
//     const res = await this.api.query(findConnLog(pool, uid), {
//       id: `brimcap/try-conn-${queryId}`,
//     })
//     const [conn] = await res.zed()
//     return conn as zed.Record | null
//   }
//
//   private setupBrimcapButtons() {
//     const searchButtonId = "wireshark-button:search"
//     const brimcapDownloadCurrentCmd = "brimcap-download-packets:current"
//
//     const itemOptions = {
//       label: "Packets",
//       icon: "sharkfin",
//       disabled: true,
//       tooltip: "No connection record found.",
//       order: 0,
//     }
//
//     const setButtonDetails = (
//       toolbarId: string,
//       buttonId: string,
//       isDisabled: boolean
//     ) => {
//       this.api.toolbar.update(toolbarId, buttonId, {
//         disabled: isDisabled,
//         tooltip: isDisabled
//           ? "No connection record found."
//           : "Open packets from this connection.",
//       })
//     }
//
//     const updateButtonStatus = (
//       toolbarId: string,
//       buttonId: string,
//       data: zed.Record,
//       setConn: (conn: zed.Record) => {}
//     ) => {
//       if (!data) {
//         setButtonDetails(toolbarId, buttonId, true)
//         return
//       }
//       this.tryConn(data, buttonId)
//         .then((conn) => {
//           setConn(conn)
//           setButtonDetails(toolbarId, buttonId, !conn)
//         })
//         .catch((err) => {
//           if (!env.isTest) console.error(err)
//           setConn(null)
//           setButtonDetails(toolbarId, buttonId, true)
//         })
//     }
//
//     // add brimcap buttons to search and detail toolbars
//     this.api.toolbar.add("search", {
//       ...itemOptions,
//       id: searchButtonId,
//       command: brimcapDownloadCurrentCmd,
//     })
//
//     // add click handlers for button's emitted commands
//     this.cleanupFns.push(
//       this.api.commands.add(
//         brimcapDownloadCurrentCmd,
//         () => this.currentConn && this.downloadPcap(this.currentConn)
//       )
//     )
//
//     // add command listeners to update button statuses
//     this.cleanupFns.push(
//       this.api.commands.add("data-detail:current", ([record]) => {
//         if (!record) return
//         const data = record as zed.Record
//
//         updateButtonStatus(
//           "search",
//           searchButtonId,
//           data,
//           (conn) => (this.currentConn = conn)
//         )
//       })
//     )
//   }
//
//   private setupContextMenus() {
//     const itemBuilder = (data: {
//       record: zed.Record
//       field: zed.Field
//     }): MenuItemConstructorOptions => {
//       const {record} = data
//       const isConn = record.try("_path")?.toString() === "conn"
//
//       return {
//         click: () => {
//           this.downloadPcap(record)
//         },
//         enabled: isConn,
//         label: "Download packets",
//       }
//     }
//
//     this.api.contextMenus.search.add(itemBuilder)
//   }
//
//   private logToSearchOpts(log: zed.Record): searchOptions {
//     const ts = log.get("ts") as zed.Time
//
//     const tsString = ts.toString()
//     const dur = log.try("duration") as zed.Duration
//     const dest = join(
//       this.api.getPath("temp"),
//       `packets-${tsString}.pcap`.replace(/:/g, "_")
//     )
//
//     return {
//       dstIp: log.get(["id", "resp_h"]).toString(),
//       dstPort: log.get(["id", "resp_p"]).toString(),
//       duration: dur?.isSet() ? dur.toString() : "0s",
//       proto: log.get("proto").toString(),
//       root: this.brimcapDataRoot,
//       srcIp: log.get(["id", "orig_h"]).toString(),
//       srcPort: log.get(["id", "orig_p"]).toString(),
//       ts: tsString,
//       write: dest,
//     }
//   }
//
//   private async downloadPcap(log: zed.Record) {
//     let searchOpts
//     try {
//       searchOpts = this.logToSearchOpts(log)
//     } catch (e) {
//       console.error(e)
//       this.api.toast.error(
//         "Flow's 5-tuple and/or time span was not found in the connection record"
//       )
//       return
//     }
//
//     const searchAndOpen = async () => {
//       const res = await this.cli.search(searchOpts)
//       if (res.status > 0) {
//         const err = res.stderr.toString()
//         const msg = JSON.parse(err)?.error || `brimcap search failed: ${err}`
//
//         throw new Error(msg)
//       }
//
//       return await open(searchOpts.write, {newWindow: true})
//     }
//
//     this.api.toast.promise(
//       searchAndOpen(),
//       {
//         loading: "Preparing pcap...",
//         success: "Preparation complete",
//         error: (err) => {
//           console.error(err)
//           return "Error preparing pcap: " + err.message
//         },
//       },
//       this.toastConfig
//     )
//   }
//
//   private setupConfig() {
//     this.api.configs.add({
//       name: pluginNamespace,
//       title: "Brimcap Settings",
//       properties: {
//         [yamlConfigPropName]: {
//           name: yamlConfigPropName,
//           type: "file",
//           label: "Brimcap YAML Config File",
//           defaultValue: "",
//           helpLink: {
//             label: "docs",
//             url: "https://github.com/brimdata/brimcap/wiki/Custom-Brimcap-Config",
//           },
//         },
//       },
//     })
//   }
//
//   private async updateSuricata() {
//     /* To get better coverage we can mock the spawn call */
//     if (env.isTest) return
//     const zdepsDirectory = this.api.getPath("zdeps")
//     const cmdName = env.isWindows ? "suricataupdater.exe" : "suricataupdater"
//     const cmdPath = path.join(zdepsDirectory, "suricata", cmdName)
//     const proc = spawn(cmdPath)
//     this.processes[proc.pid] = proc
//
//     let err
//     proc.on("error", (e) => (err = e))
//
//     await new Promise<void>((res) =>
//       proc.on("close", () => {
//         delete this.processes[proc.pid]
//         res()
//       })
//     )
//
//     if (err)
//       throw new Error(`Error updating Suricata rules: ${err.message || err}`)
//   }
//
//   async cleanup() {
//     await Promise.all(
//       Object.values(this.processes).map((p: ChildProcess) => {
//         return new Promise<void>((res) => {
//           if (p.killed) {
//             delete this.processes[p.pid]
//             res()
//             return
//           }
//
//           p.on("exit", () => {
//             delete this.processes[p.pid]
//             res()
//           })
//           p.kill()
//         })
//       })
//     )
//   }
// }
