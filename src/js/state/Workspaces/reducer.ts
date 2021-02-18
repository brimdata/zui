import {WorkspaceAction, WorkspacesState} from "./types"
import produce from "immer"

const init = (): WorkspacesState => {
  return {}
}

export default produce((draft: WorkspacesState, action: WorkspaceAction) => {
  switch (action.type) {
    case "$WORKSPACE_ADD":
      draft[action.workspace.id] = action.workspace
      return
    case "$WORKSPACE_REMOVE":
      delete draft[action.id]
      return
    case "$WORKSPACE_SET_AUTH0_TOKEN":
      if (draft[action.workspaceId] && draft[action.workspaceId].authData) {
        draft[action.workspaceId].authData.accessToken = action.accessToken
      }
      return
  }
}, init())
