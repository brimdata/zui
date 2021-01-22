import produce from "immer"
import {WorkspaceStatusesAction, WorkspaceStatusesState} from "./types"

const init = (): WorkspaceStatusesState => {
  return {}
}

export default produce(
  (draft: WorkspaceStatusesState, action: WorkspaceStatusesAction) => {
    switch (action.type) {
      case "WORKSPACE_STATUSES_SET":
        draft[action.workspaceId] = action.status
        return
      case "WORKSPACE_STATUSES_REMOVE":
        delete draft[action.workspaceId]
        return
    }
  },
  init()
)
