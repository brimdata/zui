/* @flow */

import type {Thunk} from "../reducers/types"
import {
  clearAllCorrelations,
  clearAnalysis,
  clearDescriptors,
  clearFilterTree,
  clearHistogram,
  clearLogs,
  clearSearchBar,
  clearSearchHistory,
  clearSpaces,
  clearStarredLogs,
  clearTimeWindows
} from "../actions"
import {clearViewer} from "../viewer/actions"

export const disconnect = (): Thunk => (dispatch) => {
  dispatch(clearLogs())
  dispatch(clearAnalysis())
  dispatch(clearDescriptors())
  dispatch(clearSearchBar())
  dispatch(clearAllCorrelations())
  dispatch(clearSpaces())
  dispatch(clearTimeWindows())
  dispatch(clearFilterTree())
  dispatch(clearStarredLogs())
  dispatch(clearSearchHistory())
  dispatch(clearViewer())
  dispatch(clearHistogram())
}
