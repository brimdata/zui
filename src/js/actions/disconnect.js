/* @flow */

import type {Thunk} from "../reducers/types"
import {clearAllCorrelations} from "./correlations"
import {clearAnalysis} from "./analysis"
import {clearDescriptors} from "./descriptors"
import {clearFilterTree} from "./filterTree"
import {clearHistogram} from "./histogram"
import {clearLogViewer} from "./logViewer"
import {clearLogs} from "./logs"
import {clearSearchBar} from "./searchBar"
import {clearSearchHistory} from "./searchHistory"
import {clearSpaces} from "./spaces"
import {clearStarredLogs} from "./starredLogs"
import {clearTimeWindows} from "./timeWindow"

export const disconnect = (): Thunk => dispatch => {
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
  dispatch(clearLogViewer())
  dispatch(clearHistogram())
}
