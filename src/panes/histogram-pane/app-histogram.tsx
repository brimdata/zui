import {useSelector} from "react-redux"
import Histogram from "src/js/state/Histogram"
import {useState} from "react"
import {StackedHistogram} from "./stacked-histogram"
import {useDispatch} from "src/app/core/state"
import Editor from "src/js/state/Editor"
import submitSearch from "src/app/query-home/flows/submit-search"
import useSelect from "src/app/core/hooks/use-select"
import Current from "src/js/state/Current"
import PoolSettings from "src/js/state/PoolSettings"
import * as d3 from "d3"
import {Tooltip} from "./tooltip"
import {Point, WidePoint} from "./types"
import {HistogramError} from "./histogram-error"
import * as zed from "@brimdata/zed-js"
import styles from "./histogram-pane.module.css"
import {State} from "src/js/state/types"

function formatData(points: zed.Value[]) {
  const data = points.map((p) => p.toJS()) as Point[]
  const keys = Array.from(new Set(data.map((d) => d.group))).sort()
  const defaultWidePoint = keys.reduce<WidePoint>(
    (wide, key: string) => ({...wide, [key]: 0}),
    {time: new Date(), sum: 0} as WidePoint
  )

  function widen(wide: WidePoint, point: Point) {
    const sum = wide.sum + point.count
    const time = point.time
    return {...wide, [point.group]: point.count, sum, time} as WidePoint
  }

  const map = d3.rollup<Point, number, WidePoint>(
    data,
    (values) => values.reduce(widen, defaultWidePoint),
    (v) => v.time.getTime()
  )

  const widePoints = Array.from(map.values())

  const stack = d3.stack().keys(keys)(widePoints)

  return {keys, map, stack, widePoints}
}

function hasTimeField(data: zed.Record[]) {
  return data.every((r) => r.has("time", zed.TypeTime))
}

function hasGroupField(data: zed.Record[]) {
  return data.every((r) => r.has("group") && !r.get("group").isUnset())
}

export function AppHistogram(props: {width: number; height: number}) {
  const range = useSelector(Histogram.getRange)
  const interval = useSelector(Histogram.getInterval)
  const data = useSelector(Histogram.getData) as zed.Record[]
  const poolId = useSelector(Current.getPoolFromQuery)?.id
  const settings = useSelector((s: State) =>
    PoolSettings.findWithDefaults(s, poolId)
  )
  const {timeField, colorField} = settings
  let error = useSelector(Histogram.getError)

  if (error) {
    // pass through
  } else if (!range || !interval) {
    error = `No date range found with '${timeField}'.`
  } else if (data.length === 0) {
    error = "No data."
  } else if (!hasTimeField(data)) {
    error = `Field '${timeField}' did not return time values.`
  } else if (!hasGroupField(data)) {
    error = `Field '${colorField}' did not return any groups.`
  }

  if (error) {
    return <HistogramError message={error} />
  } else {
    return (
      <HistogramChart
        range={range}
        data={data}
        interval={interval.fn}
        width={props.width}
        height={props.height}
      />
    )
  }
}

export function HistogramChart(props: {
  width: number
  height: number
  range: [Date, Date]
  interval: d3.TimeInterval
  data: zed.Value[]
}) {
  const {width, height, range, data, interval} = props
  const dispatch = useDispatch()
  const select = useSelect()
  const [tooltipStyle, setTooltipStyle] = useState({})
  const [tooltipData, setTooltipData] = useState(null)
  const {keys, map, stack, widePoints} = formatData(data)

  // Make the scales
  const xDomain = [interval(range[0]), interval.offset(interval(range[1]))]
  const xScale = d3.scaleUtc().domain(xDomain)
  const yDomain = [0, d3.max(widePoints, (v) => v.sum)]
  const yScale = d3.scaleLinear().domain(yDomain)
  const colorScale = d3
    .scaleOrdinal<string, string>()
    .domain(keys)
    .range(d3.schemeCategory10)

  function onBrushMove() {
    setTooltipStyle((s) => ({...s, opacity: 0}))
  }

  function onBrushEnd([from, to]: [Date, Date]) {
    const poolId = select(Current.getPoolFromQuery)?.id
    const settings = select((s) => PoolSettings.findWithDefaults(s, poolId))
    const field = settings.timeField
    dispatch(Editor.setTimeRange({field, from, to}))
    dispatch(submitSearch())
  }

  function onPointerMove(e) {
    const [x] = d3.pointer(e)
    const ts = interval.floor(xScale.invert(x))
    const data = map.get(ts.getTime()) ?? null
    if (!data) return
    setTooltipData(data)
    setTooltipStyle((s) => ({
      ...s,
      transform: `translateX(${x + 40}px)`,
    }))
  }

  function onPointerLeave() {
    setTooltipStyle((s) => ({...s, opacity: 0}))
  }

  function onPointerEnter() {
    setTooltipStyle((s) => ({...s, opacity: 1}))
  }

  return (
    <>
      <StackedHistogram
        className={styles.graphic}
        width={width}
        height={height}
        interval={interval}
        data={stack}
        xScale={xScale}
        yScale={yScale}
        colorScale={colorScale}
        margin={{top: 24, bottom: 24, right: 14, left: 14}}
        onBrushEnd={onBrushEnd}
        onBrushMove={onBrushMove}
        onBrushPointerMove={onPointerMove}
        onBrushPointerEnter={onPointerEnter}
        onBrushPointerLeave={onPointerLeave}
      />
      <Tooltip
        style={tooltipStyle}
        data={tooltipData}
        colorScale={colorScale}
      />
    </>
  )
}
