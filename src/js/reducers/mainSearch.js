/* @flow */

import {createSelector} from "reselect"

import type {State} from "./types"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getDescriptors} from "./descriptors"
import {getLogTuples} from "./logs"
import {getPrimarySearch} from "../selectors/boomSearches"
import {getTimeWindow} from "../reducers/timeWindow"
import {isTimeWindow} from "../models/TimeWindow"
import Log from "../models/Log"
import ParallelSearch from "../models/ParallelSearch"
import UniqArray from "../models/UniqArray"
import countByTimeInterval from "../lib/countByTimeInterval"
import createReducer from "./createReducer"

const initialState = {
  status: "INIT",
  request: null
}

export type MainSearch = {
  status: "INIT" | "FETCHING" | "COMPLETE",
  request: ?ParallelSearch
}

export default createReducer(initialState, {
  MAIN_SEARCH_CLEAR: () => ({
    ...initialState
  }),
  MAIN_SEARCH_REQUEST: (state, {request}) => {
    return {
      ...initialState,
      status: "FETCHING",
      request
    }
  },
  MAIN_SEARCH_COMPLETE: state => ({
    ...state,
    status: "COMPLETE",
    request: null
  })
})

const BOOM_INTERVALS = {
  millisecond: "ms",
  second: "sec",
  minute: "min",
  hour: "hr",
  day: "day"
}

export const getMainSearchIsFetching = createSelector<State, void, *, *>(
  getPrimarySearch,
  search => {
    return !!(search && search.status === "FETCHING")
  }
)

export const getMainSearchIsComplete = (state: State) => {
  return getMainSearchStatus(state) === "COMPLETE"
}

export const getMainSearchStatus = (state: State) => {
  return state.mainSearch.status
}

export const getMainSearchRequest = (state: State) => {
  return state.mainSearch.request
}

export const getTds = createSelector<State, void, *, *>(
  getLogTuples,
  tuples => {
    const uniq = new UniqArray()
    tuples.forEach(([td]) => uniq.push(td))
    return uniq.toArray()
  }
)

export const getEventLogs = createSelector<State, void, *, *, *, *>(
  getLogTuples,
  getDescriptors,
  getCurrentSpaceName,
  (tuples, descriptors, spaceName) => {
    const logs = []
    for (let i = 0; i < tuples.length; ++i) {
      const tuple = tuples[i]
      const descriptor = descriptors[spaceName + "." + tuple[0]]
      if (descriptor) {
        logs.push(new Log(tuple, descriptor))
      }
    }
    return logs
  }
)

export const getLogs = createSelector<State, void, *, *>(
  getEventLogs,
  logs => logs
)

export const getCountByTimeProc = createSelector<State, void, *, *>(
  getTimeWindow,
  timeWindow => {
    if (isTimeWindow(timeWindow)) {
      const {number, unit} = countByTimeInterval(timeWindow)
      return `every ${number}${BOOM_INTERVALS[unit]} count() by _path`
    } else {
      return ""
    }
  }
)
