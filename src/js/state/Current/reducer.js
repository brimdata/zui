/* @flow */

import type {CurrentAction, CurrentState} from "./types"
import produce from "immer"

const init: CurrentState = {}

export default produce((draft: CurrentState, action: CurrentAction) => {
  switch (action.type) {
    case "CURRENT_SPACE_SET":
      draft.spaceId = action.id
      return
    case "CURRENT_CONNECTION_SET":
      draft.connectionId = action.id
      return
  }
}, init)
