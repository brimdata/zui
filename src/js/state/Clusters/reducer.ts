import {ClusterAction, ClustersState} from "./types"
import produce from "immer"

const init = (): ClustersState => {
  return {}
}

export default produce((draft: ClustersState, action: ClusterAction) => {
  switch (action.type) {
    case "CLUSTER_ADD":
      draft[action.cluster.id] = action.cluster
      return
    case "CLUSTER_REMOVE":
      delete draft[action.id]
      return
    case "CLUSTER_SET_STATUS":
      if (!draft[action.id]) return
      draft[action.id].status = action.status
      return
    case "CLUSTER_SET_NAME":
      if (!draft[action.id]) return
      draft[action.id].name = action.name
      return
  }
}, init())
