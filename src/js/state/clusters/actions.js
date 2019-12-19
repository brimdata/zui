/* @flow */
import type {CLUSTER_ADD, CLUSTER_REMOVE, Cluster} from "./types"

export function addCluster(cluster: Cluster): CLUSTER_ADD {
  return {type: "CLUSTER_ADD", cluster}
}

export function removeCluster(cluster: Cluster): CLUSTER_REMOVE {
  return {type: "CLUSTER_REMOVE", cluster}
}
