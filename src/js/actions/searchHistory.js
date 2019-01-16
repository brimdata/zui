/* @flow */

import {pickEntryOffState} from "../reducers/searchHistory"
import type {Thunk} from "redux-thunk"

export const pushSearchHistory = (): Thunk => (dispatch, getState) => {
  dispatch({
    type: "SEARCH_HISTORY_PUSH",
    entry: pickEntryOffState(getState())
  })
}

export const backSearchHistory = () => ({
  type: "SEARCH_HISTORY_BACK"
})

export const forwardSearchHistory = () => ({
  type: "SEARCH_HISTORY_FORWARD"
})

export const clearSearchHistory = () => ({
  type: "SEARCH_HISTORY_CLEAR"
})
