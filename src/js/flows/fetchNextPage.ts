import {isEmpty} from "lodash"

import {Thunk} from "../state/types"
import {indexOfLastChange} from "../lib/Array"
import {viewerSearch} from "./searches/viewerSearch"
import Search from "../state/Search"
import Tabs from "../state/Tabs"
import Viewer from "../state/Viewer"
import brim from "../brim"
import {DateTuple} from "../lib/TimeWindow"
import Log from "../models/Log"

export const fetchNextPage = (): Thunk => (dispatch, getState) => {
  const state = getState()
  const args = Search.getArgs(state)
  const logs = Viewer.getLogs(state)
  const tabId = Tabs.getActive(state)
  const [spliceIndex, span] = nextPageArgs(logs, args.span)
  const [from, to] = span
  dispatch(Viewer.splice(tabId, spliceIndex))
  return dispatch(
    viewerSearch({
      query: args.tableProgram,
      from,
      to,
      target: "events",
      append: true
    })
  )
}

function nextPageArgs(logs: Log[], span: DateTuple): [number, DateTuple] {
  let spliceIndex = 0
  const nextSpan: DateTuple = [...span]
  if (!isEmpty(logs)) {
    const index = indexOfLastChange(logs, (log) => log.getString("ts"))
    if (index >= 0) {
      const prevTs = logs[index].getField("ts").toDate()
      nextSpan[1] = brim
        .time(prevTs)
        .add(1, "ms")
        .toDate()
      spliceIndex = index + 1
    }
  }
  return [spliceIndex, nextSpan]
}
