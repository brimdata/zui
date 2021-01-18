import {State} from "../types"
import {WorkspaceStatus} from "./types"

export default {
  get: (workspaceId: string) => (state: State): WorkspaceStatus => {
    return state.workspaceStatuses[workspaceId]
  }
}
