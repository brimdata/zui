/* @flow */

import type {State, Dispatch} from "../reducers/types"
import {getInnerTimeWindow} from "../reducers/timeWindow"
import {getSearchProgram} from "../selectors/searchBar"
import {
  searchAnalytics,
  searchHead,
  searchHistogram,
  searchPaged,
  searchSubset
} from "../actions/searches"
import ParallelSearch from "../models/ParallelSearch"
import * as Program from "../lib/Program"

export const create = (dispatch: Dispatch, state: State) => {
  switch (getType(state)) {
    case "ANALYTICS":
      return new ParallelSearch(dispatch, [searchAnalytics()])
    case "LOGS_HEAD":
      return new ParallelSearch(dispatch, [searchHistogram(), searchHead()])
    case "LOGS_PAGED":
      return new ParallelSearch(dispatch, [searchHistogram(), searchPaged()])
    case "LOGS_SUBSET":
      return new ParallelSearch(dispatch, [searchSubset()])
    default:
      throw "Unknown Search Type"
  }
}

export const getType = (state: State) => {
  if (Program.hasAnalytics(getSearchProgram(state))) {
    return "ANALYTICS"
  } else if (getInnerTimeWindow(state)) {
    return "LOGS_SUBSET"
  } else if (Program.hasHeadOrTailProc(getSearchProgram(state))) {
    return "LOGS_HEAD"
  } else {
    return "LOGS_PAGED"
  }
}
