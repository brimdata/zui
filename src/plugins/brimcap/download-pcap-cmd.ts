export {}

// import * as zed from "@brimdata/zed-js"
// import { SearchOptions } from "./brimcap-cli"
// import {join} from "path"
// import {app} from "electron"
// import {window} from "src/zui"
//
// function logToSearchOpts(log: zed.Record, root: string): SearchOptions {
//     const ts = log.get("ts") as zed.Time
//
//     const tsString = ts.toString()
//     const dur = log.try("duration") as zed.Duration
//     const dest = join(
//       app.getPath("temp"),
//       `packets-${tsString}.pcap`.replace(/:/g, "_")
//     )
//
//     return {
//       dstIp: log.get(["id", "resp_h"]).toString(),
//       dstPort: log.get(["id", "resp_p"]).toString(),
//       duration: dur?.isSet() ? dur.toString() : "0s",
//       proto: log.get("proto").toString(),
//       root,
//       srcIp: log.get(["id", "orig_h"]).toString(),
//       srcPort: log.get(["id", "orig_p"]).toString(),
//       ts: tsString,
//       write: dest,
//     }
//
//
// export function downloadPcap(log: zed.Record, root: string) {
//   let searchOpts
//   try {
//     searchOpts = logToSearchOpts(log, root)
//   } catch (e) {
//     console.error(e)
//     window.showErrorMessage(
//       "Flow's 5-tuple and/or time span was not found in the connection record"
//     )
//     return
//   }
//
//   const searchAndOpen = async () => {
//     const res = await this.cli.search(searchOpts)
//     if (res.status > 0) {
//       const err = res.stderr.toString()
//       const msg = JSON.parse(err)?.error || `brimcap search failed: ${err}`
//
//       throw new Error(msg)
//     }
//
//     return await open(searchOpts.write, {newWindow: true})
//   }
//
//   this.api.toast.promise(
//     searchAndOpen(),
//     {
//       loading: "Preparing pcap...",
//       success: "Preparation complete",
//       error: (err) => {
//         console.error(err)
//         return "Error preparing pcap: " + err.message
//       },
//     },
//     this.toastConfig
//   )
// }
