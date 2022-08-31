import {ZedScript} from "src/app/core/models/zed-script"
import {Pool} from "src/app/core/pools/pool"
import {syncPool} from "src/app/core/pools/sync-pool"
import {BrimQuery} from "src/app/query-home/utils/brim-query"
import span from "src/js/brim/span"
import histogramInterval, {timeUnits} from "src/js/lib/histogramInterval"
import {DateTuple} from "src/js/lib/TimeWindow"
import Current from "src/js/state/Current"
import {TimeRangeQueryPin} from "src/js/state/Editor/types"
import Pools from "src/js/state/Pools"
import {QueryVersion} from "src/js/state/QueryVersions/types"
import {Thunk} from "src/js/state/types"
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
    else return dispatch(getRangeFromPool(name))
  }

function histogramZed(baseQuery: string, range: DateTuple | null) {
  if (!range) return null
  const {number, unit} = histogramInterval(range)
  const interval = `${number}${timeUnits[unit]}`
  return `${baseQuery} | count() by every(${interval}), _path`
}

const getRangeFromPool =
  (poolName: string): Thunk<Promise<DateTuple>> =>
  async (dispatch) => {
    if (!poolName) return null
    const pool = await dispatch(ensurePoolLoaded(poolName))
    if (!pool) return
    return span(pool.everythingSpan()).toDateTuple()
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

const ensurePoolLoaded =
  (name: string): Thunk<Promise<Pool>> =>
  (dispatch, getState) => {
    const lakeId = Current.getLakeId(getState())
    const pool = Pools.getByName(lakeId, name)(getState())
    if (!pool) return Promise.resolve(null)
    if (pool.hasStats()) {
      return Promise.resolve(pool)
    } else {
      return dispatch(syncPool(pool.id, lakeId))
    }
  }
