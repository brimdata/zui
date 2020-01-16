/* @flow */
import {isEmpty} from "lodash"

import type {Thunk} from "../state/types"
import {getSearchProgram} from "../state/selectors/searchBar"
import {getViewerLogs} from "../state/viewer/selector"
import {indexOfLastChange} from "../lib/Array"
import {spliceViewer} from "../state/viewer/actions"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import brim from "../brim"
import executeTableSearch from "./executeTableSearch"
import searchArgs from "./searchArgs"

export const fetchNextPage = (): Thunk => (dispatch, getState) => {
  let state = getState()
  let logs = getViewerLogs(state)
  let currentSpan = Tab.getSpanAsDates(state)
  let tabId = Tabs.getActive(state)
  let [spliceIndex, span] = nextPageArgs(logs, currentSpan)
  let program = getSearchProgram(state)
  let space = Tab.spaceName(state)
  let spanFocus = null

  dispatch(spliceViewer(tabId, spliceIndex))
  dispatch(
    executeTableSearch(
      searchArgs.events({tabId, program, span, spanFocus, space})
    )
  )
}

function nextPageArgs(logs, span) {
  let spliceIndex = 0
  if (!isEmpty(logs)) {
    let index = indexOfLastChange(logs, (log) => log.get("ts"))

    if (index >= 0) {
      const prevTs = logs[index].getField("ts").toDate()
      span[1] = brim
        .time(prevTs)
        .add(1, "ms")
        .toDate()
      spliceIndex = index + 1
    }
  }
  return [spliceIndex, span]
}
