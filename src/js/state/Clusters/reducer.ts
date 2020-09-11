import {ClusterAction, ClustersState} from "./types"
import {deleteKey} from "../../lib/obj"

let init: ClustersState = {}

export default function(state: ClustersState = init, action: ClusterAction) {
  switch (action.type) {
    case "CLUSTER_ADD":
      return {
        ...state,
        [action.cluster.id]: action.cluster
      }
    case "CLUSTER_REMOVE":
      return deleteKey(state, action.id)
    default:
      return state
  }
}
