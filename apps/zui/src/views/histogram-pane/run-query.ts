import Current from "src/js/state/Current"
import PoolSettings from "src/js/state/PoolSettings"
import {QueryModel} from "src/js/models/query-model"
import {getInterval, timeUnits} from "./get-interval"
import Histogram from "src/js/state/Histogram"
import {QueryPin, TimeRangeQueryPin} from "src/js/state/Editor/types"
import Results from "src/js/state/Results"
import ZuiApi from "src/js/api/zui-api"
import {isAbortError} from "src/util/is-abort-error"

export const HISTOGRAM_RESULTS = "histogram"
const POOL_RANGE = "pool-range"
const NULL_TIME_COUNT = "null-time-count"
const MISSING_TIME_COUNT = "missing-time-count"

export async function runHistogramQuery(api: ZuiApi) {
  // all these queries should maybe be attached to the same abort signal
  // this would change the abortables api a bit
  api.abortables.abort({tag: POOL_RANGE})
  api.abortables.abort({tag: NULL_TIME_COUNT})
  api.abortables.abort({tag: MISSING_TIME_COUNT})
  api.abortables.abort({tag: HISTOGRAM_RESULTS})

  const id = HISTOGRAM_RESULTS
  const tabId = api.current.tabId
  const key = api.current.location.key
  const version = api.select(Current.getVersion)
  const poolId = api.select(Current.getPoolFromQuery)?.id
  const baseQuery = QueryModel.versionToZed(version)
  const {timeField, colorField} = api.select((s) =>
    PoolSettings.findWithDefaults(s, poolId)
  )

  function setup() {
    api.dispatch(Results.init({id, tabId, key, query: ""}))
    api.dispatch(Histogram.init())
  }

  function collect({rows}) {
    api.dispatch(Results.setValues({id, tabId, values: rows}))
  }

  function error(error: Error) {
    if (isAbortError(error)) return
    api.dispatch(Results.error({id, tabId, error: error.message}))
  }

  function success() {
    api.dispatch(Results.success({id, tabId}))
  }

  function isRangePin(p: QueryPin) {
    return p.type === "time-range" && !p.disabled && p.field === timeField
  }

  function getPinRange() {
    const rangePin = version.pins.find(isRangePin) as TimeRangeQueryPin
    return rangePin
      ? ([new Date(rangePin.from), new Date(rangePin.to)] as [Date, Date])
      : null
  }

  async function getPoolRange() {
    const query = `from ${poolId} | min(${timeField}), max(${timeField})`
    const resp = await api.query(query, {id: POOL_RANGE, tabId})
    const [{min, max}] = await resp.js()
    if (!(min instanceof Date && max instanceof Date)) return null
    return [min, max] as [Date, Date]
  }

  async function getNullTimeCount() {
    // Newline after baseQuery in case it ends with a comment.
    const query = `${baseQuery}\n | ${timeField} == null | count()`
    try {
      const resp = await api.query(query, {id: NULL_TIME_COUNT, tabId})
      const [count] = await resp.js()
      api.dispatch(Histogram.setNullXCount(count ?? 0))
    } catch (e) {
      if (isAbortError(e)) return
      throw e
    }
  }

  async function getMissingTimeCount() {
    // Newline after baseQuery in case it ends with a comment.
    const query = `${baseQuery}\n | !has(${timeField}) | count()`
    try {
      const resp = await api.query(query, {id: MISSING_TIME_COUNT, tabId})
      const [count] = await resp.js()
      api.dispatch(Histogram.setMissingXCount(count ?? 0))
    } catch (e) {
      if (isAbortError(e)) return
      throw e
    }
  }

  async function run() {
    const range = getPinRange() || (await getPoolRange())
    if (!range)
      throw new Error(`Unable to determine date range using '${timeField}'.`)

    const {unit, number, fn} = getInterval(range)
    const interval = `${number}${timeUnits[unit]}`
    // Newline after baseQuery in case it ends with a comment.
    const query = `${baseQuery}\n | ${timeField} != null | count() by time := bucket(${timeField}, ${interval}), group := ${colorField} | sort time`
    const resp = await api.query(query, {id: HISTOGRAM_RESULTS, tabId})
    api.dispatch(Histogram.setInterval({unit, number, fn}))
    api.dispatch(Histogram.setRange(range))
    resp.collect(collect)
    getNullTimeCount()
    getMissingTimeCount()
    await resp.promise
  }

  try {
    setup()
    await run()
    success()
  } catch (e) {
    error(e)
  }
}
