import {Lake} from "../../../../packages/superdb-node-client/dist"
import {net} from "electron"

export class ElectronZedLake extends Lake {
  fetch = net.fetch
}
