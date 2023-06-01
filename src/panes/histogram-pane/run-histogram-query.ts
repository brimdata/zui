import {run} from "src/core/query/run"
import {buildQuery} from "./build-query"

export const HISTOGRAM_RESULTS = "zui/histogram"

export function runHistogramQuery() {
  return async (dispatch) => {
    const query = await dispatch(
      buildQuery({x: "datesold", color: "typeof(this)"})
    )
    dispatch(run({id: HISTOGRAM_RESULTS, query}))
  }
}
