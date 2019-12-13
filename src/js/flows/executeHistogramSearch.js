/* @flow */
import type {SearchArgs} from "./searchArgs"
import type {Thunk} from "../state/types"
import {addEveryCountProc} from "../searches/histogramSearch"
import brim from "../brim"
import chart from "../state/chart"
import executeSearch from "./executeSearch"

export default function executeHistogramSearch({
  program,
  span,
  space
}: SearchArgs): Thunk {
  return function(dispatch) {
    let histogram = brim
      .search(addEveryCountProc(program, span), span, space)
      .id("Histogram")
      .status((status) => dispatch(chart.setStatus(status)))
      .chunk((records) => dispatch(chart.appendRecords(records)))

    dispatch(chart.clear())
    dispatch(chart.setStatus("FETCHING"))
    return dispatch(executeSearch(histogram))
  }
}
