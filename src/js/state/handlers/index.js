/* @flow */

import type {ReturnType} from "../../types"
import BoomRequest from "../../services/BoomClient/lib/BoomRequest"

type HandlersAction =
  | ReturnType<typeof abort>
  | ReturnType<typeof register>
  | ReturnType<typeof remove>

export type HandlersState = {[string]: BoomRequest}

function register(id: string, handler: BoomRequest) {
  return {type: "HANDLERS_REGISTER", id, handler}
}

function abort(id: string, emit: boolean = true) {
  return {type: "HANDLERS_ABORT", id, emit}
}

function remove(id: string) {
  return {type: "HANDLERS_REMOVE", id}
}

function abortAll(emit: boolean = true) {
  return {type: "HANLDERS_ABORT_ALL", emit}
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
      if (handler) handler.abort(action.emit)
      var abortState = {...state}
      delete abortState[action.id]
      return abortState
    case "HANLDERS_ABORT_ALL":
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

export default {
  register,
  abort,
  abortAll,
  remove,
  reducer
}
