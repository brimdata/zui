/* @flow */

import type {SearchRecord} from "../types"
import type {Thunk} from "../reducers/types"
import {restoreSearchBar} from "./searchBar"
import {setInnerTimeWindow, setOuterTimeWindow} from "./timeWindow"

export const backSearchHistory = () => ({
  type: "SEARCH_HISTORY_BACK"
})

export const forwardSearchHistory = () => ({
  type: "SEARCH_HISTORY_FORWARD"
})

export const clearSearchHistory = () => ({
  type: "SEARCH_HISTORY_CLEAR"
})

export function restoreSearch(record: SearchRecord): Thunk {
  return function(dispatch) {
    dispatch(
      restoreSearchBar({
        current: record.program,
        previous: "",
        pinned: record.pins,
        editing: null,
        error: null
      })
    )
    dispatch(setOuterTimeWindow(record.span))
    dispatch(setInnerTimeWindow(null))
  }
}
