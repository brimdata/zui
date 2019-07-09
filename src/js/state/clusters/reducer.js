/* @flow */
import {isEqual} from "lodash"

import type {Cluster, ClusterAction, ClustersState} from "./types"

let init: ClustersState = {
  saved: [],
  current: null,
  error: "",
  state: "none"
}

export default function(state: ClustersState = init, action: ClusterAction) {
  switch (action.type) {
    case "CLUSTER_ADD":
      return {
        ...state,
        saved: addCluster(state.saved, action.cluster)
      }
    case "CLUSTER_REMOVE":
      return {
        ...state,
        saved: removeCluster(state.saved, action.cluster)
      }
    case "CLUSTER_SET":
      return {
        ...state,
        current: action.cluster
      }
    case "CLUSTER_ERROR_SET":
      return {
        ...state,
        error: action.error
      }
    case "CLUSTER_STATE_SET":
      return {
        ...state,
        state: action.state
      }
    default:
      return state
  }
}

function removeCluster(clusters, cluster): Cluster[] {
  return clusters.filter((c) => !isEqual(c, cluster))
}

function addCluster(clusters, cluster): Cluster[] {
  let exists = clusters.find((c) => isEqual(c, cluster))
  if (exists) {
    return clusters
  } else {
    return [...clusters, cluster]
  }
}
