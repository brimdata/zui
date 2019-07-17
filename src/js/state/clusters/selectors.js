/* @flow */

// Actions

// Selectors
import type {State} from "../types"

export function getCurrentCluster(state: State) {
  return state.clusters.current
}

export function getSavedClusters(state: State) {
  return state.clusters.saved
}

export function getClusterMessage(state: State) {
  return state.clusters.error
}
