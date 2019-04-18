/* @flow */

import type {Thunk} from "redux-thunk"
import {isEmpty} from "lodash"

import {add} from "../../lib/Time"
import {getLogs} from "../selectors/logs"
import {getPrevSearchProgram} from "../selectors/searchBar"
import {getTimeWindow} from "../reducers/timeWindow"
import {indexOfLastChange} from "../../lib/Array"
import {issueBoomSearch} from "./boomSearches"
import {spliceResults} from "../results/actions"
import LogSearch from "../../models/searches/LogSearch"

export const fetchAhead = (): Thunk => (dispatch, getState) => {
  const state = getState()
  const logs = getLogs(state)
  let searchSpan = getTimeWindow(state)
  let spliceIndex = 0

  if (!isEmpty(logs)) {
    const index = indexOfLastChange(logs, (log) => log.get("ts"))
    const prevTs = logs[index].getField("ts").toDate()

    if (index >= 0) {
      searchSpan[1] = add(prevTs, 1, "ms")
      spliceIndex = index + 1
    }
  }

  dispatch(spliceResults(spliceIndex))
  dispatch(
    issueBoomSearch(
      new LogSearch(getPrevSearchProgram(state), searchSpan),
      "viewer"
    )
  )
}
