import {Client} from "@brimdata/zed-node"
import {net} from "electron"

export class ElectronZedClient extends Client {
  fetch = net.fetch
}
