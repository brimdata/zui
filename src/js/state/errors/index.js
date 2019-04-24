/* @flow */
import type {State} from "../types"
import {head} from "../../lib/Array"
import AppError from "../../models/AppError"
import ErrorFactory from "../../models/ErrorFactory"

export type ErrorsState = AppError[]
export type ERROR_CREATE = {type: "ERROR_CREATE", error: AppError}
export type ERRORS_CLEAR = {type: "ERRORS_CLEAR"}
type Action = ERROR_CREATE | ERRORS_CLEAR

export function createError(raw: any): ERROR_CREATE {
  return {type: "ERROR_CREATE", error: ErrorFactory.create(raw)}
}

export function clearErrors(): ERRORS_CLEAR {
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
      return head([action.error, ...state], 30)
    case "ERRORS_CLEAR":
      return []
    default:
      return state
  }
}
