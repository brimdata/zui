export type Cluster = {
  id: string
  name: string
  host: string
  port: string
  username: string
  password: string
  version?: string
}

export type ClustersState = {
  [key: string]: Cluster
}

export type ClusterAction = CLUSTER_REMOVE | CLUSTER_ADD

export type CLUSTER_REMOVE = {
  type: "CLUSTER_REMOVE"
  id: string
}

export type CLUSTER_ADD = {
  type: "CLUSTER_ADD"
  cluster: Cluster
}
