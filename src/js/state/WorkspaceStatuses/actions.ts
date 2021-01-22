import {WorkspaceStatus} from "./types"

export default {
  set(workspaceId: string, status: WorkspaceStatus) {
    return {type: "WORKSPACE_STATUSES_SET", workspaceId, status}
  },
  remove(workspaceId: string) {
    return {type: "WORKSPACE_STATUSES_REMOVE", workspaceId}
  }
}
