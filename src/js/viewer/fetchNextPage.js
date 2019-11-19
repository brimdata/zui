/* @flow */
import {isEmpty} from "lodash"

import {PER_PAGE} from "./config"
import type {Thunk} from "../state/types"
import {addHeadProc} from "../lib/Program"
import {getSearchProgram} from "../state/selectors/searchBar"
import {getViewerLogs} from "../state/viewer/selector"
import {indexOfLastChange} from "../lib/Array"
import {issueSearch} from "../searches/issueSearch"
import {spliceViewer} from "../state/viewer/actions"
import brim from "../brim"
import search from "../state/search"
import viewerHandler from "./viewerHandler"

export const fetchNextPage = (): Thunk => (dispatch, getState) => {
  const state = getState()
  const logs = getViewerLogs(state)
  let searchSpan = search.getSpanAsDates(state)
  let spliceIndex = 0

  if (!isEmpty(logs)) {
    const index = indexOfLastChange(logs, (log) => log.get("ts"))

    if (index >= 0) {
      const prevTs = logs[index].getField("ts").toDate()
      searchSpan[1] = brim
        .time(prevTs)
        .add(1, "ms")
        .toDate()
      spliceIndex = index + 1
    }
  }

  dispatch(spliceViewer(spliceIndex))
  dispatch(
    issueSearch({
      name: "ViewerSearch",
      tag: "viewer",
      program: addHeadProc(getSearchProgram(state), PER_PAGE),
      span: searchSpan,
      handlers: [viewerHandler]
    })
  )
}
