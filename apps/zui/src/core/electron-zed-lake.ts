import {Lake} from "@brimdata/zed-node"
import {net} from "electron"

export class ElectronZedLake extends Lake {
  fetch =
    process.env.JEST_WORKER_ID === undefined ? net.fetch : globalThis.fetch
}
