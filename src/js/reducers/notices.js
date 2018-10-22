/* @flow */

import type {State} from "./types"
import createReducer from "./createReducer"

const initialState = {
  error: null
}

export type Notices = typeof initialState

export default createReducer(initialState, {
  NOTICE_ERROR_SET: (state, {message}) => ({
    ...state,
    error: message
  }),
  NOTICE_DISMISS: () => ({...initialState})
})

export const getError = (state: State) => state.notices.error
