/* @flow */

import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "./config"
import type {SearchArgs} from "./searchArgs"
import type {Thunk} from "../state/types"
import Viewer from "../state/viewer"
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
      .status((status) => dispatch(Viewer.setStatus(tabId, status)))
      .chan(0, (records, types) => {
        dispatch(Viewer.appendRecords(tabId, records))
        dispatch(Viewer.updateColumns(tabId, types))
      })
      .stats((stats) => dispatch(Viewer.setStats(tabId, stats)))
      .end((_id, count) =>
        dispatch(Viewer.setEndStatus(tabId, endStatus(count)))
      )

    dispatch(Viewer.setStatus(tabId, "FETCHING"))
    dispatch(Viewer.setEndStatus(tabId, "FETCHING"))
    return dispatch(executeSearch(table))
  }
}

function endStatus(count) {
  if (count === PER_PAGE) return "INCOMPLETE"
  if (count === ANALYTIC_MAX_RESULTS) return "LIMIT"
  return "COMPLETE"
}
