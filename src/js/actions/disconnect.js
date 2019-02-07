/* @flow */

import {clearMainSearch} from "./mainSearch"
import {clearDescriptors} from "./descriptors"
import {clearSearchBar} from "./searchBar"
import {clearTuplesByUid} from "./tuplesByUid"
import {clearSpaces} from "./spaces"
import {clearTimeWindows} from "./timeWindow"
import {clearFilterTree} from "./filterTree"
import {clearStarredLogs} from "./starredLogs"
import {clearSearchHistory} from "./searchHistory"
import {clearLogViewer} from "./logViewer"
import {clearCountByTime} from "./countByTime"
import type {Thunk} from "../reducers/types"

export const disconnect = (): Thunk => (dispatch, _g, _a) => {
  dispatch(clearMainSearch())
  dispatch(clearDescriptors())
  dispatch(clearSearchBar())
  dispatch(clearTuplesByUid())
  dispatch(clearSpaces())
  dispatch(clearTimeWindows())
  dispatch(clearFilterTree())
  dispatch(clearStarredLogs())
  dispatch(clearSearchHistory())
  dispatch(clearLogViewer())
  dispatch(clearCountByTime())
}
