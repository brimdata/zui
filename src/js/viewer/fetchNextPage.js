/* @flow */
import {isEmpty} from "lodash"

import {PER_PAGE} from "./config"
import type {Thunk} from "../state/types"
import {add} from "../lib/Time"
import {addHeadProc} from "../lib/Program"
import {getPrevSearchProgram} from "../state/selectors/searchBar"
import {getTimeWindow} from "../state/reducers/timeWindow"
import {getViewerLogs} from "../state/viewer/selector"
import {indexOfLastChange} from "../lib/Array"
import {issueSearch} from "../searches/issueSearch"
import {spliceViewer} from "../state/viewer/actions"
import viewerHandler from "./viewerHandler"

export const fetchNextPage = (): Thunk => (dispatch, getState) => {
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
    issueSearch({
      name: "ViewerSearch",
      tag: "viewer",
      program: addHeadProc(getPrevSearchProgram(state), PER_PAGE),
      span: searchSpan,
      handlers: [viewerHandler]
    })
  )
}
