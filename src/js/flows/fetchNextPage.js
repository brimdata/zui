/* @flow */
import {isEmpty} from "lodash"

import type {Thunk} from "../state/types"
import {getViewerLogs} from "../state/viewer/selector"
import {indexOfLastChange} from "../lib/Array"
import {spliceViewer} from "../state/viewer/actions"
import brim from "../brim"
import executeTableSearch from "./executeTableSearch"
import search from "../state/search"
import searchArgs from "./searchArgs"

export const fetchNextPage = (): Thunk => (dispatch, getState) => {
  let state = getState()
  let logs = getViewerLogs(state)
  // FIX
  let tab = search.getTab(state)
  let [spliceIndex, span] = nextPageArgs(logs, tab.span)

  dispatch(spliceViewer(spliceIndex))
  dispatch(executeTableSearch(searchArgs.events({...tab, span})))
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
