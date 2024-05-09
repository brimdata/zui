import {Client} from "@brimdata/zed-node"
import {net} from "electron"

export class ElectronZedClient extends Client {
  fetch =
    process.env.JEST_WORKER_ID === undefined ? net.fetch : globalThis.fetch
}
