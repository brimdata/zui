/* @flow */

import type {Thunk} from "redux-thunk"

import {PER_PAGE} from "../reducers/logViewer"
import {getTimeWindow} from "../reducers/timeWindow"
import * as Arr from "../lib/Array"
import * as Program from "../lib/Program"
import * as Time from "../lib/Time"
import logsReceiver from "../receivers/logsReceiver"
import * as mainSearch from "../reducers/mainSearch"
import pageReceiver from "../receivers/pageReceiver"
import * as searchBar from "../selectors/searchBar"
import * as spaces from "../reducers/spaces"

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

export const fetchAhead = (): Thunk => (dispatch, getState, boom) => {
  dispatch(setIsFetchingAhead(true))
  const state = getState()
  const logs = mainSearch.getLogs(state)
  let searchSpan = getTimeWindow(state)
  let spliceIndex = 0
  if (!Arr.isEmpty(logs)) {
    const index = Arr.indexOfLastChange(logs, log => log.get("ts"))
    if (index >= 0) {
      const from = Time.add(logs[index].getField("ts").toDate(), 1, "ms")
      const [_, to] = getTimeWindow(state)
      searchSpan = [from, to]
      spliceIndex = index + 1
    }
  }
  const searchSpace = spaces.getCurrentSpaceName(state)
  const program = searchBar.getPrevSearchProgram(state)
  const programWithHead = Program.addHeadProc(program, PER_PAGE)
  boom
    .search(programWithHead, {searchSpan, searchSpace})
    .channel(0, pageReceiver(dispatch, PER_PAGE, spliceIndex))
    .channel(0, logsReceiver(dispatch))
    .done(() => setTimeout(() => dispatch(setIsFetchingAhead(false)), 500))
}
