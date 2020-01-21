/* @flow */

import type {SearchRecord} from "../../types"
import type {Thunk} from "../types"
import Search from "../Search"
import SearchBar from "../SearchBar"

export function restoreSearch(record: SearchRecord): Thunk {
  return function(dispatch) {
    dispatch(
      SearchBar.restoreSearchBar({
        current: record.program,
        previous: "",
        pinned: record.pins,
        editing: null,
        error: null
      })
    )
    dispatch(Search.setSpanArgs(record.spanArgs))
    dispatch(Search.setSpanFocus(null))
  }
}
