/* @flow */

import type {Cluster} from "./types"
import type {State} from "../types"
import tab from "../tab"

export const getCurrentCluster = tab.select<?Cluster>(
  (tab) => tab.search.cluster
)

export function getSavedClusters(state: State) {
  return state.clusters.saved
}
