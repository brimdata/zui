import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import React, {useMemo} from "react"
import * as d3 from "d3"
import {DateTuple} from "../../../lib/TimeWindow"
import {Pen, HistogramChart} from "../types"
import {innerHeight, innerWidth} from "../dimens"
import {submitSearch} from "../../../flows/submitSearch/mod"
import Chart from "../../../state/Chart"
import EmptyMessage from "../../EmptyMessage"
import HistogramTooltip from "../../HistogramTooltip"
import LoadingMessage from "../../LoadingMessage"
import barStacks from "../pens/barStacks"
import brim from "../../../brim"
import format from "./format"
import hoverLine from "../pens/hoverLine"
import reactComponent from "../pens/reactComponent"
import search from "../../../state/Search"
import tab from "../../../state/Tab"
import useConst from "../../hooks/useConst"
import xAxisBrush from "../pens/xAxisBrush"
import xAxisTime from "../pens/xAxisTime"
import xPositionTooltip from "../pens/xPositionTooltip"
import yAxisSingleTick from "../pens/yAxisSingleTick"

export default function useMainHistogram(
  width: number,
  height: number
): HistogramChart {
  const chartData = useSelector(Chart.getData)
  const status = useSelector(Chart.getStatus)
  const span = useSelector(tab.getSpanAsDates)

  const dispatch = useDispatch()
  const pens = useConst<Pen[]>([], () => {
    function onDragEnd(span: DateTuple) {
      dispatch(search.setSpanArgs(brim.dateTuple(span).toSpan()))
      dispatch(submitSearch())
    }

    function onSelection(span: DateTuple) {
      dispatch(search.setSpanArgsFromDates(span))
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
    const data = format(chartData, span)
    const maxY = d3.max(data.points, (d) => d.count) || 0
    const oneCharWidth = 5.5366666667
    const chars = d3.format(",")(maxY).length
    const yAxisWidth = chars * oneCharWidth + 3
    const minWidth = 38
    const margins = {
      left: Math.max(minWidth, yAxisWidth + 8),
      right: 8,
      top: 3,
      bottom: 16,
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
  }, [chartData, status, span, width, height])
}
