/* @flow */

import type {Thunk} from "../reducers/types"
import {clearAnalysis} from "./analysis"
import {clearHistogram} from "./histogram"
import {clearDescriptors} from "./descriptors"
import {clearFilterTree} from "./filterTree"
import {clearLogViewer} from "./logViewer"
import {clearLogs} from "./logs"
import {clearSearchBar} from "./searchBar"
import {clearSearchHistory} from "./searchHistory"
import {clearSpaces} from "./spaces"
import {clearStarredLogs} from "./starredLogs"
import {clearTimeWindows} from "./timeWindow"
import {clearTuplesByUid} from "./tuplesByUid"

export const disconnect = (): Thunk => dispatch => {
  dispatch(clearLogs())
  dispatch(clearAnalysis())
  dispatch(clearDescriptors())
  dispatch(clearSearchBar())
  dispatch(clearTuplesByUid())
  dispatch(clearSpaces())
  dispatch(clearTimeWindows())
  dispatch(clearFilterTree())
  dispatch(clearStarredLogs())
  dispatch(clearSearchHistory())
  dispatch(clearLogViewer())
  dispatch(clearHistogram())
}
