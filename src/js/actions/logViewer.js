/* @flow */

import type {Thunk} from "redux-thunk"

import {getLogs} from "../selectors/logs"
import {getTimeWindow} from "../reducers/timeWindow"
import {issueBoomSearch} from "./boomSearches"
import {setLogsSpliceIndex} from "./logs"
import * as Arr from "../lib/Array"
import LogSearch from "../models/searches/LogSearch"
import * as Time from "../lib/Time"
import * as searchBar from "../selectors/searchBar"

export const clearLogViewer = () => ({
  type: "LOG_VIEWER_CLEAR"
})

export const setMoreBehind = (value: boolean) => ({
  type: "LOG_VIEWER_MORE_BEHIND_SET",
  value
})

export const setMoreAhead = (value: boolean) => ({
  type: "LOG_VIEWER_MORE_AHEAD_SET",
  value
})

export const setIsFetchingBehind = (value: boolean) => ({
  type: "LOG_VIEWER_IS_FETCHING_BEHIND_SET",
  value
})

export const setIsFetchingAhead = (value: boolean) => ({
  type: "LOG_VIEWER_IS_FETCHING_AHEAD_SET",
  value
})

export const fetchAhead = (): Thunk => (dispatch, getState) => {
  const state = getState()
  const logs = getLogs(state)
  let searchSpan = getTimeWindow(state)
  let spliceIndex = 0

  if (!Arr.isEmpty(logs)) {
    const index = Arr.indexOfLastChange(logs, (log) => log.get("ts"))
    if (index >= 0) {
      const to = Time.add(logs[index].getField("ts").toDate(), 1, "ms")
      const [from, _] = getTimeWindow(state)
      searchSpan = [from, to]
      spliceIndex = index + 1
    }
  }

  dispatch(setIsFetchingAhead(true))
  dispatch(setLogsSpliceIndex(spliceIndex))
  dispatch(
    issueBoomSearch(
      new LogSearch(searchBar.getPrevSearchProgram(state), searchSpan),
      "viewer"
    )
  ).done(() => setTimeout(() => dispatch(setIsFetchingAhead(false)), 500))
}
