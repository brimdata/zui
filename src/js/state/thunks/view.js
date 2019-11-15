/* @flow */

import type {State, Thunk} from "../types"
import {getSearchProgram} from "../selectors/searchBar"
import {getSearchInspectorIsOpen} from "../reducers/view"
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
