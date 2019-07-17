/* @flow */

import type {State} from "../state/types"
import AppError from "../models/AppError"

export type BackendState = {
  error: ?AppError
}

type Actions = BACKEND_ERROR_SET

type BACKEND_ERROR_SET = {type: "BACKEND_ERROR_SET", error: ?AppError}

let init: BackendState = {error: null}

export function setBackendError(error: ?AppError): BACKEND_ERROR_SET {
  return {
    type: "BACKEND_ERROR_SET",
    error
  }
}

export function getBackendError(state: State) {
  return state.backend.error
}

export function backendReducer(state: BackendState = init, action: Actions) {
  switch (action.type) {
    case "BACKEND_ERROR_SET":
      return {
        ...state,
        error: action.error
      }
    default:
      return state
  }
}
