import {run} from "src/core/query/run"
import Current from "src/js/state/Current"
import PoolSettings from "src/js/state/PoolSettings"
import {Thunk} from "src/js/state/types"
import {QueryModel} from "src/js/models/query-model"
import {getInterval, timeUnits} from "./get-interval"
import Histogram from "src/js/state/Histogram"
import {TimeRangeQueryPin} from "src/js/state/Editor/types"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import Results from "src/js/state/Results"

export const HISTOGRAM_RESULTS = "histogram"
export const HISTOGRAM_RANGE = "histogram-range"

export function runHistogramQuery(): Thunk {
  return async (dispatch, getState) => {
    const version = Current.getVersion(getState())
    const baseQuery = QueryModel.versionToZed(version)
    const poolId = Current.getPoolFromQuery(getState())?.id
    const settings = PoolSettings.findWithDefaults(getState(), poolId)
    const {timeField, colorField} = settings
    const range = await dispatch(getHistogramRange(poolId, timeField, version))
    if (!range) {
      dispatch(
        Results.error({
          id: HISTOGRAM_RESULTS,
          error: `Unable to determine date range using '${timeField}'.`,
        })
      )
      return
    }
    const intervalObj = getInterval(range)
    const interval = `${intervalObj.number}${timeUnits[intervalObj.unit]}`
    const query = getHistogramQuery({
      baseQuery,
      interval,
      timeField,
      colorField,
    })
    dispatch(Histogram.setRange(range))
    dispatch(Histogram.setInterval(intervalObj))
    dispatch(
      run({
        id: HISTOGRAM_RESULTS,
        query,
        collectOpts: {every: {ms: 1000, count: Infinity}},
      })
    )
  }

  function getHistogramRange(
    poolId: string,
    timeField: string,
    version: QueryVersion
  ): Thunk<Promise<[Date, Date] | null>> {
    return async (dispatch) => {
      const pinRange = getTimeRangePin(version.pins, timeField)
      if (pinRange) return pinRange
      const query = `from ${poolId} | min(${timeField}), max(${timeField})`
      const resp = await dispatch(run({id: HISTOGRAM_RANGE, query}))
      if (resp) {
        const [row] = await resp.js()
        return [row.min, row.max]
      } else {
        return null
      }
    }
  }

  function getTimeRangePin(pins, timeField): [Date, Date] | null {
    const rangePin = pins.find(
      (p) => p.field === timeField && p.type === "time-range" && !p.disabled
    ) as TimeRangeQueryPin

    if (rangePin) {
      return [new Date(rangePin.from), new Date(rangePin.to)]
    } else {
      return null
    }
  }

  function getHistogramQuery(args: {
    baseQuery: string
    interval: string
    timeField: string
    colorField: string
  }) {
    return `
${args.baseQuery} 
| count() by time := bucket(${args.timeField}, ${args.interval}), group := ${args.colorField} | sort time`
  }
}
