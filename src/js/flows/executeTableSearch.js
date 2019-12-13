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
  space
}: SearchArgs): Thunk {
  return function(dispatch) {
    let table = brim
      .search(program, span, space)
      .id("Table")
      .status((status) => dispatch(setViewerStatus(status)))
      .chunk((records, types) => {
        dispatch(appendViewerRecords(records))
        dispatch(updateViewerColumns(types))
      })
      .stats((stats) => dispatch(setViewerStats(stats)))
      .end((_id, count) => dispatch(setViewerEndStatus(endStatus(count))))

    dispatch(setViewerStatus("FETCHING"))
    dispatch(setViewerEndStatus("FETCHING"))
    return dispatch(executeSearch(table))
  }
}

function endStatus(count) {
  if (count === PER_PAGE) return "INCOMPLETE"
  if (count === ANALYTIC_MAX_RESULTS) return "LIMIT"
  return "COMPLETE"
}
