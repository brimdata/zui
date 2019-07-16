/* @flow */
import type {
  CLUSTER_ADD,
  CLUSTER_ERROR_SET,
  CLUSTER_REMOVE,
  CLUSTER_SET,
  CLUSTER_STATE_SET,
  Cluster,
  ClusterStateEnum
} from "./types"

export function setCluster(cluster: Cluster | null): CLUSTER_SET {
  return {type: "CLUSTER_SET", cluster}
}

export function addCluster(cluster: Cluster): CLUSTER_ADD {
  return {type: "CLUSTER_ADD", cluster}
}

export function removeCluster(cluster: Cluster): CLUSTER_REMOVE {
  return {type: "CLUSTER_REMOVE", cluster}
}

export function setClusterMessage(error: string): CLUSTER_ERROR_SET {
  return {type: "CLUSTER_ERROR_SET", error}
}

export function setClusterState(state: ClusterStateEnum): CLUSTER_STATE_SET {
  return {type: "CLUSTER_STATE_SET", state}
}
