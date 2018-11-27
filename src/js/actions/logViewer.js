/* @flow */

import type {Thunk} from "redux-thunk"
import * as Arr from "../lib/Array"
import * as Time from "../lib/Time"
import * as mainSearch from "../reducers/mainSearch"
import {getTimeWindow} from "../reducers/timeWindow"
import * as spaces from "../reducers/spaces"
import * as searchBar from "../reducers/searchBar"
import * as Program from "../lib/Program"
import logsReceiver from "../receivers/logsReceiver"
import pageReceiver from "../receivers/pageReceiver"

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

export const fetchAhead = (): Thunk => (dispatch, getState, api) => {
  const PER_PAGE = 200
  dispatch(setIsFetchingAhead(true))
  const state = getState()
  const logs = mainSearch.getLogs(state)
  let timeWindow = getTimeWindow(state)
  let spliceIndex = 0
  if (!Arr.isEmpty(logs)) {
    const index = Arr.indexOfLastChange(logs, log => log.get("ts"))
    if (index >= 0) {
      const from = Time.add(logs[index].getField("ts").toDate(), 1, "ms")
      const [_, to] = getTimeWindow(state)
      timeWindow = [from, to]
      spliceIndex = index + 1
    }
  }
  const space = spaces.getCurrentSpaceName(state)
  const program = searchBar.getPrevSearchProgram(state)
  const programWithHead = Program.addHeadProc(program, PER_PAGE)
  api
    .search({string: programWithHead, timeWindow, space})
    .channel(0, pageReceiver(dispatch, PER_PAGE, spliceIndex))
    .channel(0, logsReceiver(dispatch))
    .done(() => dispatch(setIsFetchingAhead(false)))
}
