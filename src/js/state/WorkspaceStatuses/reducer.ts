import {createReducer} from "@reduxjs/toolkit"
import {
  WorkspaceStatusesState,
  WORKSPACE_STATUSES_REMOVE,
  WORKSPACE_STATUSES_SET
} from "./types"

export default createReducer({} as WorkspaceStatusesState, {
  WORKSPACE_STATUSES_SET: (state, action: WORKSPACE_STATUSES_SET) => {
    state[action.workspaceId] = action.status
  },
  WORKSPACE_STATUSES_REMOVE: (state, action: WORKSPACE_STATUSES_REMOVE) => {
    delete state[action.workspaceId]
  }
})
