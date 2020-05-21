/* @flow */

import type {State} from "../types"
import zealot from "../../services/zealot"

export default {
  id: (id: string) => (state: State) => state.clusters[id],
  getZealot: (id: string) => (state: State) => {
    const cl = state.clusters[id]
    if (cl) return zealot.client(cl.host + ":" + cl.port)
    return zealot.client("localhost:9867")
  },
  all: (state: State) => Object.values(state.clusters),
  raw: (state: State) => state.clusters
}
