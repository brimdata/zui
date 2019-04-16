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

export function restoreSearch(search: SearchRecord): Thunk {
  return function(dispatch) {
    dispatch(
      restoreSearchBar({
        current: search.program,
        previous: "",
        pinned: search.pins,
        editing: null,
        error: null
      })
    )
    dispatch(setOuterTimeWindow(search.span))
    dispatch(setInnerTimeWindow(null))
  }
}
