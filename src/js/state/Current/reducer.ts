import produce from "immer"

import {CurrentAction, CurrentState} from "./types"

const init = (): CurrentState => ({
  spaceId: null,
  workspaceId: null
})

export default produce((draft: CurrentState, action: CurrentAction) => {
  switch (action.type) {
    case "CURRENT_SPACE_SET":
      draft.spaceId = action.id
      return
    case "CURRENT_WORKSPACE_SET":
      draft.workspaceId = action.id
      return
  }
}, init())
