/* @flow */

import type {SearchRecord} from "../../types"
import type {Thunk} from "../types"
import {restoreSearchBar} from "../actions"
import search from "../search"

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
    dispatch(search.setSpanArgs(record.spanArgs))
    dispatch(search.setSpanFocus(null))
  }
}
