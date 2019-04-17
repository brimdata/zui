/* @flow */

import type {Thunk} from "redux-thunk"
import {isEmpty} from "lodash"

import {add} from "../../lib/Time"
import {getLogs} from "../selectors/logs"
import {getPrevSearchProgram} from "../selectors/searchBar"
import {getTimeWindow} from "../reducers/timeWindow"
import {indexOfLastChange} from "../../lib/Array"
import {issueBoomSearch} from "./boomSearches"
import {setIsFetchingAhead, setLogsSpliceIndex} from "../actions"
import LogSearch from "../../models/searches/LogSearch"

export const fetchAhead = (): Thunk => (dispatch, getState) => {
  const state = getState()
  const logs = getLogs(state)
  let searchSpan = getTimeWindow(state)
  let spliceIndex = 0

  if (!isEmpty(logs)) {
    const index = indexOfLastChange(logs, (log) => log.get("ts"))
    if (index >= 0) {
      const to = add(logs[index].getField("ts").toDate(), 1, "ms")
      const [from, _] = getTimeWindow(state)
      searchSpan = [from, to]
      spliceIndex = index + 1
    }
  }

  dispatch(setIsFetchingAhead(true))
  dispatch(setLogsSpliceIndex(spliceIndex))
  dispatch(
    issueBoomSearch(
      new LogSearch(getPrevSearchProgram(state), searchSpan),
      "viewer"
    )
  ).done(() => setTimeout(() => dispatch(setIsFetchingAhead(false)), 500))
}
