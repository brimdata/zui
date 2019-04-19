/* @flow */

import type {Thunk} from "redux-thunk"
import {isEmpty} from "lodash"

import {add} from "../../lib/Time"
import {createViewerSearch} from "../../searches/templates/viewerSearch"
import {getPrevSearchProgram} from "../selectors/searchBar"
import {getTimeWindow} from "../reducers/timeWindow"
import {getViewerLogs} from "../viewer/selector"
import {indexOfLastChange} from "../../lib/Array"
import {issueBoomSearch} from "./boomSearches"
import {spliceViewer} from "../viewer/actions"

export const fetchAhead = (): Thunk => (dispatch, getState) => {
  const state = getState()
  const logs = getViewerLogs(state)
  let searchSpan = getTimeWindow(state)
  let spliceIndex = 0

  if (!isEmpty(logs)) {
    const index = indexOfLastChange(logs, (log) => log.get("ts"))

    if (index >= 0) {
      const prevTs = logs[index].getField("ts").toDate()
      searchSpan[1] = add(prevTs, 1, "ms")
      spliceIndex = index + 1
    }
  }

  dispatch(spliceViewer(spliceIndex))
  dispatch(
    issueBoomSearch(createViewerSearch(getPrevSearchProgram(state), searchSpan))
  )
}
