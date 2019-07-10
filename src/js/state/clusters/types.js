/* @flow */

export type Cluster = {
  host: string,
  port: string,
  username: string,
  password: string
}

export type ClustersState = {
  saved: Cluster[],
  current: Cluster | null,
  error: string,
  state: ClusterStateEnum
}

export type ClusterStateEnum = "testing" | "ok" | "error" | "none"

export type ClusterAction =
  | CLUSTER_REMOVE
  | CLUSTER_ADD
  | CLUSTER_SET
  | CLUSTER_ERROR_SET
  | CLUSTER_STATE_SET

export type CLUSTER_REMOVE = {
  type: "CLUSTER_REMOVE",
  cluster: Cluster
}

export type CLUSTER_ADD = {
  type: "CLUSTER_ADD",
  cluster: Cluster
}

export type CLUSTER_SET = {
  type: "CLUSTER_SET",
  cluster: Cluster | null
}

export type CLUSTER_ERROR_SET = {
  type: "CLUSTER_ERROR_SET",
  error: string
}

export type CLUSTER_STATE_SET = {
  type: "CLUSTER_STATE_SET",
  state: ClusterStateEnum
}
