import {QueryModel} from "src/js/models/query-model"
import histogramInterval, {timeUnits} from "src/js/lib/histogramInterval"
import {DateTuple} from "src/js/lib/TimeWindow"
import Current from "src/js/state/Current"
import {TimeRangeQueryPin} from "src/js/state/Editor/types"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import {Thunk} from "src/js/state/types"
import Histogram from "src/js/state/Histogram"
import Pools from "src/js/state/Pools"

export const buildQuery =
  (args: {x: string; color: string}): Thunk<Promise<string | null>> =>
  async (dispatch, getState, {api}) => {
    const poolName = api.current.poolName
    const version = Current.getVersion(getState())
    const range = await dispatch(getRange(poolName))
    // this doesn't belong here
    dispatch(Histogram.setRange(range))
    return histogramZed(
      QueryModel.versionToZed(version),
      range,
      args.x,
      args.color
    )
  }

export const getRange =
  (name: string): Thunk<Promise<DateTuple> | DateTuple> =>
  (dispatch) => {
    const queryRange = dispatch(getRangeFromQuery())
    if (queryRange) return queryRange
    else return dispatch(Pools.getTimeRange(name))
  }

function histogramZed(
  baseQuery: string,
  range: DateTuple | null,
  x: string,
  color: string
) {
  if (!range) return null
  const {number, unit} = histogramInterval(range)
  const interval = `${number}${timeUnits[unit]}`
  return `${baseQuery} | count() by bucket(${x}, ${interval}), ${color}`
}

const getRangeFromQuery = (): Thunk<DateTuple> => (_, getState) => {
  const snapshot = Current.getVersion(getState())
  return getCurrentRange(snapshot)
}

const getCurrentRange = (snapshot: QueryVersion): DateTuple | null => {
  const rangePin = snapshot.pins.find(
    (p) => p.type === "time-range" && !p.disabled
  ) as TimeRangeQueryPin

  if (rangePin) {
    return [new Date(rangePin.from), new Date(rangePin.to)]
  } else {
    return null
  }
}
