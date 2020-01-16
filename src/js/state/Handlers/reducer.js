/* @flow */

import type {HandlersAction, HandlersState} from "./types"

export default function reducer(
  state: HandlersState = {},
  action: HandlersAction
): HandlersState {
  switch (action.type) {
    case "HANDLERS_REGISTER":
      return {...state, [action.id]: action.handler}
    case "HANDLERS_ABORT":
      var handler = state[action.id]
      if (handler) handler.abort(action.emit)
      var abortState = {...state}
      delete abortState[action.id]
      return abortState
    case "HANDLERS_ABORT_ALL":
      for (var [_id, handle] of Object.entries(state)) {
        // $FlowFixMe
        handle.abort(action.emit)
      }
      return {}
    case "HANDLERS_REMOVE":
      var removeState = {...state}
      delete removeState[action.id]
      return removeState
    default:
      return state
  }
}
