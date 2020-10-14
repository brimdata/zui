export type Cluster = {
  id: string
  name: string
  host: string
  port: string
  username: string
  password: string
  status: ClusterStatus
}

export type ClusterStatus = "initial" | "connected" | "disconnected"

export type ClustersState = {
  [key: string]: Cluster
}

export type ClusterAction =
  | CLUSTER_REMOVE
  | CLUSTER_ADD
  | CLUSTER_SET_STATUS
  | CLUSTER_SET_NAME

export type CLUSTER_REMOVE = {
  type: "CLUSTER_REMOVE"
  id: string
}

export type CLUSTER_ADD = {
  type: "CLUSTER_ADD"
  cluster: Cluster
}

export type CLUSTER_SET_STATUS = {
  type: "CLUSTER_SET_STATUS"
  id: string
  status: ClusterStatus
}

export type CLUSTER_SET_NAME = {
  type: "CLUSTER_SET_NAME"
  id: string
  name: string
}
