/* @flow */

// Actions
import type {State} from "../types"
import AppError from "../../models/AppError"

type ERROR_SET = {type: "ERROR_SET", error: AppError}
type ERROR_CLEAR = {type: "ERROR_CLEAR"}
type ERROR_DISMISS = {type: "ERROR_DISMISS"}
type Actions = ERROR_SET | ERROR_CLEAR | ERROR_DISMISS
const actions = {
  set: (error: AppError): ERROR_SET => ({type: "ERROR_SET", error}),
  clear: (): ERROR_CLEAR => ({type: "ERROR_CLEAR"}),
  dismiss: (): ERROR_DISMISS => ({type: "ERROR_DISMISS"})
}

// Selectors
const selectors = {
  getError: (state: State) => state.error.error,
  getVisible: (state: State) => state.error.visible
}

// Reducer
export type ErrorState = {error: ?AppError, visible: boolean}

let init: ErrorState = {error: null, visible: false}

function reducer(state: ErrorState = init, action: Actions) {
  switch (action.type) {
    case "ERROR_SET":
      return {...state, error: action.error, visible: true}
    case "ERROR_CLEAR":
      return {...state, error: null}
    case "ERROR_DISMISS":
      return {...state, visible: false}
    default:
      return state
  }
}

export default {
  ...actions,
  ...selectors,
  reducer
}
