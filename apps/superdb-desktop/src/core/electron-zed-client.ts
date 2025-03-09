import {Client} from "../../../../packages/superdb-node-client/dist"
import nodeFetch from "node-fetch"

export class ElectronZedClient extends Client {
  fetch = nodeFetch
}
