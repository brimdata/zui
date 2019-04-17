/* @flow */

import type {State, Thunk} from "../reducers/types"
import {getSearchInspectorIsOpen} from "../reducers/view"
import {getSearchProgram} from "../selectors/searchBar"
import {hasAnalytics} from "../../lib/Program"
import {
  hideSearchInspector,
  showAnalyticsTab,
  showLogsTab,
  showSearchInspector
} from "../actions"

export const toggleSearchInspector = (): Thunk => (dispatch, getState) => {
  if (getSearchInspectorIsOpen(getState())) {
    dispatch(hideSearchInspector())
  } else {
    dispatch(showSearchInspector())
  }
}

export const updateTab = (state: State) =>
  hasAnalytics(getSearchProgram(state)) ? showAnalyticsTab() : showLogsTab()
