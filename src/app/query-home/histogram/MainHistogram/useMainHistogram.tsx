import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import React, {useMemo} from "react"
import * as d3 from "d3"
import {DateTuple} from "src/js/lib/TimeWindow"
import {Pen, HistogramChart} from "../types"
import {innerHeight, innerWidth} from "../dimens"

import EmptyMessage from "src/js/components/EmptyMessage"
import HistogramTooltip from "src/js/components/HistogramTooltip"
import LoadingMessage from "src/js/components/LoadingMessage"
import barStacks from "../pens/barStacks"
import format from "./format"
import hoverLine from "../pens/hoverLine"
import reactComponent from "../pens/reactComponent"
import useConst from "src/js/components/hooks/useConst"
import xAxisBrush from "../pens/xAxisBrush"
import xAxisTime from "../pens/xAxisTime"
import xPositionTooltip from "../pens/xPositionTooltip"
import yAxisSingleTick from "../pens/yAxisSingleTick"
import submitSearch from "../../flows/submit-search"
import Results from "src/js/state/Results"
import {ChartData} from "src/js/state/Chart/types"
import {zed} from "packages/zealot/src"
import UniqArray from "src/js/models/UniqArray"
import MergeHash from "src/js/models/MergeHash"
import Editor from "src/js/state/Editor"
import {HISTOGRAM_RESULTS} from "src/js/state/Histogram/run-query"
import {HistogramProps} from "./Chart"

const id = HISTOGRAM_RESULTS

// get pool
// make a new brim query with the values,
// get the pool name
// get the pool
// get the full pool range

export default function useMainHistogram(
  props: HistogramProps
): HistogramChart {
  const {height, width, range} = props
  const dispatch = useDispatch()
  const chartData = useSelector(Results.getValues(id)) as zed.Record[]
  const status = useSelector(Results.getStatus(id))

  const pens = useConst<Pen[]>([], () => {
    function onDragEnd(span: DateTuple) {
      const [from, to] = span
      dispatch(Editor.setTimeRange({field: "ts", from, to}))
      dispatch(submitSearch())
    }

    function onSelection(span: DateTuple) {
      const [from, to] = span
      dispatch(Editor.setTimeRange({field: "ts", from, to}))
      dispatch(submitSearch())
    }

    return [
      xAxisTime({onDragEnd}),
      barStacks(),
      yAxisSingleTick(),
      xAxisBrush({onSelection}),
      hoverLine(),
      reactComponent((chart) => (
        <EmptyMessage show={!chart.state.isFetching && chart.state.isEmpty} />
      )),
      reactComponent((chart) => (
        <LoadingMessage show={chart.state.isFetching} message="Loading..." />
      )),
      xPositionTooltip({
        wrapperClassName: "histogram-tooltip-wrapper",
        render: HistogramTooltip,
      }),
    ]
  })

  return useMemo<HistogramChart>(() => {
    const data = format(histogramFormat(chartData), range)
    const maxY = d3.max(data.points, (d: {count: number}) => d.count) || 0
    const margins = {
      left: 16,
      right: 16,
      top: 10,
      bottom: 18,
    }
    return {
      data,
      width,
      height,
      margins,
      state: {
        isFetching: status === "FETCHING",
        isEmpty: data.points.length === 0,
        isDragging: false,
      },
      yScale: d3
        .scaleLinear()
        .range([innerHeight(height, margins), 0])
        .domain([0, maxY]),
      xScale: d3
        .scaleUtc()
        .range([0, innerWidth(width, margins)])
        .domain(data.span),
      pens,
    }
  }, [chartData, status, range, width, height])
}

function histogramFormat(records: zed.Record[]): ChartData {
  const paths = new UniqArray()
  const table = new MergeHash()

  records.forEach((r) => {
    const [ts, path, count] = r.fields.map((f) => f.data) as [
      zed.Time,
      zed.String,
      zed.Uint64
    ]

    try {
      const pathName = path.toString()
      const key = ts.toDate().getTime()
      const val = {[path.toString()]: count.toInt()}

      table.merge(key, val)
      paths.push(pathName)
    } catch (e) {
      console.log("Error rendering histogram: " + e.toString())
    }
  })

  return {
    table: table.toJSON(),
    keys: paths.toArray(),
  }
}
