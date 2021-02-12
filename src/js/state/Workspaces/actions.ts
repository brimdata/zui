import {
  WORKSPACE_ADD,
  WORKSPACE_REMOVE,
  Workspace,
  WORKSPACE_SET_AUTH0_TOKEN
} from "./types"

export default {
  add(workspace: Workspace): WORKSPACE_ADD {
    return {type: "WORKSPACE_ADD", workspace}
  },
  setWorkspaceToken(
    workspaceId: string,
    accessToken: string
  ): WORKSPACE_SET_AUTH0_TOKEN {
    return {type: "WORKSPACE_SET_AUTH0_TOKEN", workspaceId, accessToken}
  },
  remove(id: string): WORKSPACE_REMOVE {
    return {type: "WORKSPACE_REMOVE", id}
  }
}
