import {useSelector} from "react-redux"
import Current from "src/js/state/Current"
import PoolSettings from "src/js/state/PoolSettings"
import {hasTimeField, hasGroupField, hasHighCardinality} from "./format-data"
import Histogram from "src/js/state/Histogram"
import * as zed from "@brimdata/zed-js"
import {State} from "src/js/state/types"

export type DataProps = ReturnType<typeof useDataProps>

const MAX_CARDINALITY = 40

export function useDataProps() {
  const poolId = useSelector(Current.getPoolFromQuery)?.id
  const error = useSelector(Histogram.getError)
  const settings = useSelector((s: State) =>
    PoolSettings.findWithDefaults(s, poolId)
  )
  return {
    range: useSelector(Histogram.getRange),
    interval: useSelector(Histogram.getInterval)?.fn,
    data: useSelector(Histogram.getData) as zed.Record[],
    timeField: settings.timeField,
    colorField: settings.colorField,
    colorMap: settings.colorMap,
    poolId,
    error,
  }
}

export function validateDataProps(props: DataProps) {
  const {error, range, interval, timeField, colorField, data} = props
  if (error) {
    return error
  }
  if (!range || !interval) {
    return `No date range found with '${timeField}'.`
  }
  if (data.length === 0) {
    return "No data."
  }
  if (!hasTimeField(data)) {
    return `Field '${timeField}' did not return time values.`
  }
  if (!hasGroupField(data)) {
    return `Field '${colorField}' did not return any groups.`
  }
  if (hasHighCardinality(data, MAX_CARDINALITY)) {
    return `Field '${colorField}' returned too many unique values (>${MAX_CARDINALITY}).`
  }
  return null
}
