import {values} from "lodash"

import {Handler, HandlersAction, HandlersState} from "./types"

export default function reducer(
  state: HandlersState = {},
  action: HandlersAction
): HandlersState {
  switch (action.type) {
    case "HANDLERS_REGISTER":
      return {...state, [action.id]: action.handler}
    case "HANDLERS_ABORT":
      tryAbort(state[action.id])
      return remove(state, action.id)
    case "HANDLERS_ABORT_ALL":
      for (let handler of values(state)) tryAbort(handler, action.emit)

      return {}
    case "HANDLERS_REMOVE":
      return remove(state, action.id)
    default:
      return state
  }
}

function tryAbort(handler: Handler, emit: boolean = true) {
  if (handler && handler.type === "SEARCH" && handler.abort) {
    handler.abort(emit)
  }
}

function remove(state, id) {
  var nextState = {...state}
  delete nextState[id]
  return nextState
}
