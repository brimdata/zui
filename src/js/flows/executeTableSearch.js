/* @flow */

import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "./config"
import type {SearchArgs} from "./searchArgs"
import type {Thunk} from "../state/types"
import {
  appendViewerRecords,
  setViewerEndStatus,
  setViewerStats,
  setViewerStatus,
  updateViewerColumns
} from "../state/viewer/actions"
import brim from "../brim"
import executeSearch from "./executeSearch"

export default function executeTableSearch({
  program,
  span,
  space,
  tabId
}: SearchArgs): Thunk {
  return function(dispatch) {
    let table = brim
      .search(program, span, space)
      .id("Table")
      .status((status) => dispatch(setViewerStatus(tabId, status)))
      .chan(0, (records, types) => {
        dispatch(appendViewerRecords(tabId, records))
        dispatch(updateViewerColumns(tabId, types))
      })
      .stats((stats) => dispatch(setViewerStats(tabId, stats)))
      .end((_id, count) =>
        dispatch(setViewerEndStatus(tabId, endStatus(count)))
      )

    dispatch(setViewerStatus(tabId, "FETCHING"))
    dispatch(setViewerEndStatus(tabId, "FETCHING"))
    return dispatch(executeSearch(table))
  }
}

function endStatus(count) {
  if (count === PER_PAGE) return "INCOMPLETE"
  if (count === ANALYTIC_MAX_RESULTS) return "LIMIT"
  return "COMPLETE"
}
