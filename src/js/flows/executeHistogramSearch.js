/* @flow */
import type {SearchArgs} from "../state/Search/types"
import type {Thunk} from "../state/types"
import ErrorFactory from "../models/ErrorFactory"
import Notice from "../state/Notice"
import brim from "../brim"
import chart from "../state/Chart"
import executeSearch from "./executeSearch"

export default function executeHistogramSearch(
  tabId: string,
  args: SearchArgs,
  prevArgs: SearchArgs
): Thunk {
  return function(dispatch) {
    let histogram = brim
      .search(args.chartProgram, args.span, args.space)
      .id("Histogram")
      .status((status) => dispatch(chart.setStatus(tabId, status)))
      .chan(0, (records) => {
        dispatch(chart.appendRecords(tabId, records))
      })
      .error((error) => dispatch(Notice.set(ErrorFactory.create(error))))

    if (shouldClear(args, prevArgs)) dispatch(chart.clear(tabId))
    dispatch(chart.setStatus(tabId, "FETCHING"))
    return dispatch(executeSearch(histogram))
  }
}

function shouldClear(args, prev) {
  let duration = ([from, to]) => to - from

  if (
    args.chartProgram === prev.chartProgram &&
    args.space === prev.space &&
    duration(args.span) === duration(prev.span)
  ) {
    return false
  } else {
    return true
  }
}
