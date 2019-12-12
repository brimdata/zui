/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useMemo} from "react"
import * as d3 from "d3"

import type {DateTuple} from "../../../lib/TimeWindow"
import type {Pen, HistogramChart} from "../types"
import {innerHeight, innerWidth} from "../dimens"
import {submitSearchBar} from "../../../state/thunks/searchBar"
import EmptyMessage from "../../EmptyMessage"
import HistogramTooltip from "../../HistogramTooltip"
import LoadingMessage from "../../LoadingMessage"
import barStacks from "../pens/barStacks"
import brim from "../../../brim"
import chart from "../../../state/chart"
import focusBar from "../pens/focusBar"
import format from "./format"
import hoverLine from "../pens/hoverLine"
import reactComponent from "../pens/reactComponent"
import search from "../../../state/search"
import time from "../../../brim/time"
import useConst from "../../hooks/useConst"
import xAxisBrush from "../pens/xAxisBrush"
import xAxisTime from "../pens/xAxisTime"
import xPositionTooltip from "../pens/xPositionTooltip"
import yAxisSingleTick from "../pens/yAxisSingleTick"

export default function(width: number, height: number): HistogramChart {
  let records = useSelector(chart.getRecords)
  let status = useSelector(chart.getStatus)
  let span = useSelector(search.getSpanAsDates)
  let innerSpan = useSelector(search.getSpanFocusAsDates)
  let dispatch = useDispatch()
  let pens = useConst<Pen[]>([], () => {
    function onDragEnd(span: DateTuple) {
      dispatch(search.setSpanArgs(brim.dateTuple(span).toSpan()))
      dispatch(submitSearchBar())
    }

    function onSelection(span: DateTuple) {
      dispatch(search.setSpanFocus(null))
      dispatch(search.setSpanArgsFromDates(span))
      dispatch(submitSearchBar())
    }

    function onFocus(dates: DateTuple) {
      dispatch(search.setSpanFocus(time.convertToSpan(dates)))
      dispatch(submitSearchBar(false))
    }

    function onBlur() {
      dispatch(search.setSpanFocus(null))
      dispatch(submitSearchBar(false))
    }

    function onSelectionClear() {
      dispatch(search.setSpanFocus(null))
    }

    function onSelectionClick(span) {
      dispatch(search.setSpanFocus(null))
      dispatch(search.setSpanArgsFromDates(span))
      dispatch(submitSearchBar())
    }

    return [
      xAxisTime({onDragEnd}),
      barStacks(),
      yAxisSingleTick(),
      xAxisBrush({onSelection, onSelectionClear, onSelectionClick}),
      hoverLine(),
      reactComponent((chart) => (
        <EmptyMessage show={!chart.state.isFetching && chart.state.isEmpty} />
      )),
      reactComponent((chart) => (
        <LoadingMessage show={chart.state.isFetching} message="Chart Loading" />
      )),
      focusBar({onFocus, onBlur}),
      xPositionTooltip({
        wrapperClassName: "histogram-tooltip-wrapper",
        render: HistogramTooltip
      })
    ]
  })

  return useMemo<HistogramChart>(() => {
    let logs = records.map((r) => brim.interop.recordToLog(brim.record(r)))
    let data = format(logs, span)
    let margins = {left: 0, right: 0, top: 3, bottom: 16}

    return {
      data,
      width,
      height,
      margins,
      state: {
        isFetching: status === "FETCHING",
        selection: innerSpan,
        isEmpty: data.points.length === 0
      },
      yScale: d3
        .scaleLinear()
        .range([innerHeight(height, margins), 0])
        .domain([0, d3.max(data.points, (d) => d.count) || 0]),
      xScale: d3
        .scaleUtc()
        .range([0, innerWidth(width, margins)])
        .domain(span),
      pens
    }
  }, [records, status, span, innerSpan, width, height])
}
