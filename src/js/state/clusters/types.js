/* @flow */

export type Cluster = {
  id: string,
  host: string,
  port: string,
  username: string,
  password: string
}

export type ClustersState = {
  [string]: Cluster
}

export type ClusterAction = CLUSTER_REMOVE | CLUSTER_ADD

export type CLUSTER_REMOVE = {
  type: "CLUSTER_REMOVE",
  id: string
}

export type CLUSTER_ADD = {
  type: "CLUSTER_ADD",
  cluster: Cluster
}
