import {run} from "src/core/query/run"
import {buildQuery} from "./build-query"
import Current from "src/js/state/Current"
import PoolSettings from "src/js/state/PoolSettings"

export const HISTOGRAM_RESULTS = "zui/histogram"

export function runHistogramQuery() {
  return async (dispatch, getState) => {
    const poolId = Current.getPoolFromQuery(getState())?.id
    const settings = PoolSettings.find(getState(), poolId)
    if (!settings) return
    // do some checks
    const query = await dispatch(
      buildQuery({x: settings.timeField, color: settings.colorField})
    )
    console.log(query)
    dispatch(run({id: HISTOGRAM_RESULTS, query}))
  }
}
