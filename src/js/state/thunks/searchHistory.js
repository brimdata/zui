/* @flow */

import type {SearchRecord} from "../../types"
import type {Thunk} from "../types"
import {restoreSearchBar} from "../actions"
import Search from "../Search"

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
    dispatch(Search.setSpanArgs(record.spanArgs))
    dispatch(Search.setSpanFocus(null))
  }
}
