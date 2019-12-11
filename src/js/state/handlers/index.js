/* @flow */

import type {ExtractReturn} from "../../types"
import BoomRequest from "../../services/BoomClient/lib/BoomRequest"

type HandlersAction =
  | ExtractReturn<typeof abort>
  | ExtractReturn<typeof register>
  | ExtractReturn<typeof remove>
export type HandlersState = {[string]: BoomRequest}

function register(id: string, handler: BoomRequest) {
  return {type: "HANDLERS_REGISTER", id, handler}
}

function abort(id: string) {
  return {type: "HANDLERS_ABORT", id}
}

function remove(id: string) {
  return {type: "HANDLERS_REMOVE", id}
}

function reducer(
  state: HandlersState = {},
  action: HandlersAction
): HandlersState {
  switch (action.type) {
    case "HANDLERS_REGISTER":
      return {...state, [action.id]: action.handler}
    case "HANDLERS_ABORT":
      var handler = state[action.id]
      if (handler) handler.abort()
      var abortState = {...state}
      delete abortState[action.id]
      return abortState
    case "HANDLERS_REMOVE":
      var removeState = {...state}
      delete removeState[action.id]
      return removeState
    default:
      return state
  }
}

export default {
  register,
  abort,
  remove,
  reducer
}
