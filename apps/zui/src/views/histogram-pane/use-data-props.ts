import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import PoolSettings from "src/js/state/PoolSettings"
import Histogram from "src/js/state/Histogram"
import * as zed from "@brimdata/zed-js"
import {State} from "src/js/state/types"
import {HISTOGRAM_RESULTS} from "./run-query"
import Results from "src/js/state/Results"

export type DataProps = ReturnType<typeof useDataProps>

export function useDataProps() {
  const poolId = useSelector(Current.getPoolFromQuery)?.id
  const error = useSelector(Histogram.getError)
  const settings = useSelector((s: State) =>
    PoolSettings.findWithDefaults(s, poolId)
  )
  const isFetching = useSelector(Results.isFetching(HISTOGRAM_RESULTS))

  return {
    range: useSelector(Histogram.getRange),
    interval: useSelector(Histogram.getInterval)?.fn,
    data: useSelector(Histogram.getData) as zed.Record[],
    timeField: settings.timeField,
    colorField: settings.colorField,
    colorMap: settings.colorMap,
    isFetching,
    poolId,
    error,
  }
}
