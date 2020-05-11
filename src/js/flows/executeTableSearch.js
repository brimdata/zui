/* @flow */

import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "./config"
import type {SearchArgs} from "../state/Search/types"
import type {Thunk} from "../state/types"
import ErrorFactory from "../models/ErrorFactory"
import Notice from "../state/Notice"
import SearchBar from "../state/SearchBar"
import Viewer from "../state/Viewer"
import brim from "../brim"
import executeSearch from "./executeSearch"

export default function executeTableSearch(
  tabId: string,
  args: SearchArgs
): Thunk {
  return function(dispatch) {
    let table = brim
      .search(args.tableProgram, args.span, args.spaceID)
      .id("Table")
      .status((status) => dispatch(Viewer.setStatus(tabId, status)))
      .chan(0, (records, types) => {
        dispatch(Viewer.appendRecords(tabId, records))
        dispatch(Viewer.updateColumns(tabId, types))
      })
      .warnings((warnings) =>
        dispatch(SearchBar.errorSearchBarParse(warnings[0]))
      )
      .stats((stats) => dispatch(Viewer.setStats(tabId, stats)))
      .error((error) => dispatch(Notice.set(ErrorFactory.create(error))))
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
