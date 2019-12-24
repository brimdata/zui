/* @flow */

import type {Cluster} from "./types"
import type {State} from "../types"
import tab from "../tab"

export const getCurrentCluster = tab.select<?Cluster>(
  (tab) => tab.search.cluster
)

export default {
  id: (id: string) => (state: State) => state.clusters[id],
  all: (state: State) => Object.values(state.clusters)
}
