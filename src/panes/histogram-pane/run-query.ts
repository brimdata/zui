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

export async function runHistogramQuery(api: ZuiApi) {
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
    if (isAbortError(error)) return success()
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
    const resp = await api.query(query, {id, tabId})
    const [{min, max}] = await resp.js()
    if (!(min instanceof Date && max instanceof Date)) return null
    return [min, max] as [Date, Date]
  }

  async function getNullTimeCount() {
    const query = `${baseQuery}
    | ${timeField} == null | count()`
    const id = "null-time-count"
    const resp = await api.query(query, {id, tabId})
    const [count] = await resp.js()
    api.dispatch(Histogram.setNullXCount(count ?? 0))
  }

  async function getMissingTimeCount() {
    const query = `${baseQuery}
    | !has(${timeField}) | count()`
    const id = "missing-time-count"
    const resp = await api.query(query, {id, tabId})
    const [count] = await resp.js()
    api.dispatch(Histogram.setMissingXCount(count ?? 0))
  }

  async function run() {
    const range = getPinRange() || (await getPoolRange())
    if (!range)
      throw new Error(`Unable to determine date range using '${timeField}'.`)

    const {unit, number, fn} = getInterval(range)
    const interval = `${number}${timeUnits[unit]}`
    const query = `${baseQuery}
    | ${timeField} != null | count() by time := bucket(${timeField}, ${interval}), group := ${colorField} | sort time`
    const resp = await api.query(query, {id, tabId})
    api.dispatch(Histogram.setInterval({unit, number, fn}))
    api.dispatch(Histogram.setRange(range))
    resp.collect(collect, {})
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
