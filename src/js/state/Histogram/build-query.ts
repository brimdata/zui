import {ZedScript} from "src/app/core/models/zed-script"
import {BrimQuery} from "src/app/query-home/utils/brim-query"
import histogramInterval, {timeUnits} from "src/js/lib/histogramInterval"
import {DateTuple} from "src/js/lib/TimeWindow"
import Current from "src/js/state/Current"
import {TimeRangeQueryPin} from "src/js/state/Editor/types"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import {Thunk} from "src/js/state/types"
import Pools from "../Pools"
import {actions} from "./reducer"

export const buildHistogramQuery =
  (): Thunk<Promise<string | null>> =>
  async (dispatch, getState, {api}) => {
    const poolName = api.current.poolName
    const version = Current.getVersion(getState())
    const range = await dispatch(getRange(poolName))
    // this doesn't belong here
    dispatch(actions.setRange(range))
    return histogramZed(BrimQuery.versionToZed(version), range)
  }

export const getRange =
  (name: string): Thunk<Promise<DateTuple> | DateTuple> =>
  (dispatch) => {
    const queryRange = dispatch(getRangeFromQuery())
    if (queryRange) return queryRange
    else return dispatch(Pools.getTimeRange(name))
  }

function histogramZed(baseQuery: string, range: DateTuple | null) {
  if (!range) return null
  const {number, unit} = histogramInterval(range)
  const interval = `${number}${timeUnits[unit]}`
  return `${baseQuery} | count() by every(${interval}), _path`
}

const getRangeFromQuery = (): Thunk<DateTuple> => (_, getState) => {
  const snapshot = Current.getVersion(getState())
  return getCurrentRange(snapshot)
}

const getCurrentRange = (snapshot: QueryVersion): DateTuple => {
  const rangePin = snapshot.pins.find(
    (p) => p.type === "time-range" && !p.disabled
  ) as TimeRangeQueryPin

  if (rangePin) {
    return [new Date(rangePin.from), new Date(rangePin.to)]
  } else {
    return new ZedScript(BrimQuery.versionToZed(snapshot)).range as DateTuple
  }
}
