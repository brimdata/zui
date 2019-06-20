/* @flow */

// Actions

// Selectors
import type {State} from "../types"

export function getCluster(state: State) {
  return state.clusters.current
}

export function getClusters(state: State) {
  return state.clusters.saved
}

export function getClusterError(state: State) {
  return state.clusters.error
}

export function getClusterState(state: State) {
  return state.clusters.state
}
