/* @flow */
import type {State} from "../types"

export type ErrorItem = string
export type ErrorsState = ErrorItem[]
export type ERROR_CREATE = {
  type: "ERROR_CREATE",
  msg: string
}
export type ERRORS_CLEAR = {
  type: "ERRORS_CLEAR"
}
type Action = ERROR_CREATE | ERRORS_CLEAR

export function createError(msg: string) {
  return {type: "ERROR_CREATE", msg}
}

export function clearErrors() {
  return {type: "ERRORS_CLEAR"}
}

export function getErrors(state: State) {
  return state.errors
}

const init = []

export function errorsReducer(
  state: ErrorsState = init,
  action: Action
): ErrorsState {
  switch (action.type) {
    case "ERROR_CREATE":
      return [...state, action.msg]
    case "ERRORS_CLEAR":
      return []
    default:
      return state
  }
}
