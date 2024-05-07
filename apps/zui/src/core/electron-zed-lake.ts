import {Lake} from "@brimdata/zed-node"
import {net} from "electron"

export class ElectronZedLake extends Lake {
  fetch = net.fetch
}
