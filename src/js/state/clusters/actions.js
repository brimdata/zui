/* @flow */
import type {CLUSTER_ADD, CLUSTER_REMOVE, CLUSTER_SET, Cluster} from "./types"

export function setCluster(cluster: Cluster | null): CLUSTER_SET {
  return {type: "CLUSTER_SET", cluster}
}

export function addCluster(cluster: Cluster): CLUSTER_ADD {
  return {type: "CLUSTER_ADD", cluster}
}

export function removeCluster(cluster: Cluster): CLUSTER_REMOVE {
  return {type: "CLUSTER_REMOVE", cluster}
}
