import Current from "src/js/state/Current"
import PoolSettings from "src/js/state/PoolSettings"
import {getInterval, timeUnits} from "./get-interval"
import Histogram from "src/js/state/Histogram"
import {QueryPin, TimeRangeQueryPin} from "src/js/state/Editor/types"
import Results from "src/js/state/Results"
import {isAbortError} from "src/util/is-abort-error"
import {createHandler} from "src/core/handlers"
import QueryInfo from "src/js/state/QueryInfo"
import {query} from "src/domain/lake/handlers"

export const HISTOGRAM_RESULTS = "histogram"
const HISTOGRAM_TASK_ID = "run-histogram-query-task"

export const runHistogramQuery = createHandler(
  async ({select, dispatch, waitForSelector, asyncTasks}) => {
    const tabId = select(Current.getTabId)
    const {signal} = asyncTasks.createOrReplace([tabId, HISTOGRAM_TASK_ID])

    await waitForSelector(QueryInfo.getIsParsed, {signal}).toReturn(true)

    const id = HISTOGRAM_RESULTS
    const key = select(Current.getLocation).key
    const version = select(Current.getVersion)
    const poolId = select(Current.getPoolFromQuery)?.id
    const baseQuery = select(Current.getQueryText)
    const {timeField, colorField} = select((s) =>
      PoolSettings.findWithDefaults(s, poolId)
    )

    function setup() {
      dispatch(Results.init({id, tabId, key, query: ""}))
      dispatch(Histogram.init())
    }

    function collect({rows}) {
      dispatch(Results.setValues({id, tabId, values: rows}))
    }

    function error(error: Error) {
      if (isAbortError(error)) return
      dispatch(Results.error({id, tabId, error: error.message}))
    }

    function success() {
      dispatch(Results.success({id, tabId}))
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
      const queryText = `from ${poolId} | min(${timeField}), max(${timeField})`
      const resp = await query(queryText, {signal})
      const [{min, max}] = await resp.js()
      if (!(min instanceof Date && max instanceof Date)) return null
      return [min, max] as [Date, Date]
    }

    async function getNullTimeCount() {
      // Newline after baseQuery in case it ends with a comment.
      const queryText = `${baseQuery}\n | ${timeField} == null | count()`
      try {
        const resp = await query(queryText, {signal})
        const [count] = await resp.js()
        dispatch(Histogram.setNullXCount(count ?? 0))
      } catch (e) {
        if (isAbortError(e)) return
        throw e
      }
    }

    async function getMissingTimeCount() {
      // Newline after baseQuery in case it ends with a comment.
      const queryText = `${baseQuery}\n | !has(${timeField}) | count()`
      try {
        const resp = await query(queryText, {signal})
        const [count] = await resp.js()
        dispatch(Histogram.setMissingXCount(count ?? 0))
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
      const queryText = `${baseQuery}\n | ${timeField} != null | count() by time := bucket(${timeField}, ${interval}), group := ${colorField} | sort time`
      const resp = await query(queryText, {signal})
      dispatch(Histogram.setInterval({unit, number, fn}))
      dispatch(Histogram.setRange(range))
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
)
