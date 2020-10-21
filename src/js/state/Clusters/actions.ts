import {CLUSTER_ADD, CLUSTER_REMOVE, Cluster, ClusterStatus} from "./types"

export default {
  add(cluster: Cluster): CLUSTER_ADD {
    return {type: "CLUSTER_ADD", cluster}
  },
  remove(id: string): CLUSTER_REMOVE {
    return {type: "CLUSTER_REMOVE", id}
  },
  setStatus(id: string, status: ClusterStatus) {
    return {type: "CLUSTER_SET_STATUS", id, status}
  }
}
