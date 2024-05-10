import {Client} from "@brimdata/zed-node"
import {net} from "electron"

export class ElectronZedClient extends Client {
  // This avoids attempting to use Electron net.fetch in Jest tests
  fetch = net !== undefined ? net.fetch : globalThis.fetch
}
