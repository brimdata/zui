import {WORKSPACE_ADD, WORKSPACE_REMOVE, Workspace} from "./types"

export default {
  add(workspace: Workspace): WORKSPACE_ADD {
    return {type: "WORKSPACE_ADD", workspace}
  },
  remove(id: string): WORKSPACE_REMOVE {
    return {type: "WORKSPACE_REMOVE", id}
  }
}
