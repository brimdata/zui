import {State} from "../types"
import {WorkspaceStatus, WorkspaceStatusesState} from "./types"

export default {
  get: (workspaceId: string) => (state: State): WorkspaceStatus => {
    return state.workspaceStatuses[workspaceId]
  },
  all: (state: State): WorkspaceStatusesState => state.workspaceStatuses
}
