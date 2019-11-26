/* @flow */

import {NetworkError, SearchError} from "../../models/Errors"
import type {State, Thunk} from "../types"
import AppError from "../../models/AppError"

// Actions //
type NOTICE_SET = {type: "NOTICE_SET", error: AppError}
type NOTICE_CLEAR = {type: "NOTICE_CLEAR"}
type NOTICE_DISMISS = {type: "NOTICE_DISMISS"}
type Actions = NOTICE_SET | NOTICE_CLEAR | NOTICE_DISMISS
const actions = {
  set: (error: AppError): NOTICE_SET => ({type: "NOTICE_SET", error}),
  clear: (): NOTICE_CLEAR => ({type: "NOTICE_CLEAR"}),
  dismiss: (): NOTICE_DISMISS => ({type: "NOTICE_DISMISS"})
}

// Thunks
const thunks = {
  clearNetworkError: (): Thunk => (dispatch, getState) => {
    let e = selectors.getError(getState())
    if (e instanceof NetworkError) dispatch(actions.dismiss())
  },
  clearSearchError: (): Thunk => (dispatch, getState) => {
    let e = selectors.getError(getState())
    if (e instanceof SearchError) dispatch(actions.dismiss())
  }
}

// Selectors //
const selectors = {
  getError: (state: State) => state.notice.error,
  getVisible: (state: State) => state.notice.visible
}

// Reducer //
export type NoticeState = {error: ?AppError, visible: boolean}

let init: NoticeState = {error: null, visible: false}

function reducer(state: NoticeState = init, action: Actions) {
  switch (action.type) {
    case "NOTICE_SET":
      return {...state, error: action.error, visible: true}
    case "NOTICE_CLEAR":
      return {...state, error: null}
    case "NOTICE_DISMISS":
      return {...state, visible: false}
    default:
      return state
  }
}

export default {
  ...actions,
  ...selectors,
  ...thunks,
  reducer
}
