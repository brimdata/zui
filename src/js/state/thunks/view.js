/* @flow */

import type {Thunk} from "../types"
import {getSearchInspectorIsOpen} from "../reducers/view"
import {hideSearchInspector, showSearchInspector} from "../actions"

export const toggleSearchInspector = (): Thunk => (dispatch, getState) => {
  if (getSearchInspectorIsOpen(getState())) {
    dispatch(hideSearchInspector())
  } else {
    dispatch(showSearchInspector())
  }
}
