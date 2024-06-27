import produce from "immer"
import {LakeStatusesAction, LakeStatusesState} from "./types"

const init = (): LakeStatusesState => {
  return {}
}

export default produce(
  (draft: LakeStatusesState, action: LakeStatusesAction) => {
    switch (action.type) {
      case "LAKE_STATUSES_SET":
        draft[action.lakeId] = action.status
        return
      case "LAKE_STATUSES_REMOVE":
        delete draft[action.lakeId]
        return
    }
  },
  init()
)
