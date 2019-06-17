/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useMemo} from "react"
import * as d3 from "d3"

import type {Pen, HistogramChart} from "../types"
import type {Span} from "../../BoomClient/types"
import {fetchMainSearch} from "../../viewer/fetchMainSearch"
import {getHistogramSearch} from "../../state/searches/selector"
import {
  getInnerTimeWindow,
  getTimeWindow
} from "../../state/reducers/timeWindow"
import {innerHeight, innerWidth} from "../dimens"
import {resultsToLogs} from "../../log/resultsToLogs"
import {setInnerTimeWindow, setOuterTimeWindow} from "../../state/actions"
import EmptyMessage from "../../components/EmptyMessage"
import HistogramTooltip from "../../components/HistogramTooltip"
import LoadingMessage from "../../components/LoadingMessage"
import barStacks from "../pens/barStacks"
import focusBar from "../pens/focusBar"
import format from "./format"
import hoverLine from "../pens/hoverLine"
import reactComponent from "../pens/reactComponent"
import useConst from "../../hooks/useConst"
import xAxisBrush from "../pens/xAxisBrush"
import xAxisTime from "../pens/xAxisTime"
import xPositionTooltip from "../pens/xPositionTooltip"
import yAxisSingleTick from "../pens/yAxisSingleTick"

export default function(width: number, height: number): HistogramChart {
  let search = useSelector(getHistogramSearch)
  let span = useSelector(getTimeWindow)
  let innerSpan = useSelector(getInnerTimeWindow)
  let dispatch = useDispatch()
  let pens = useConst<Pen[]>([], () => {
    function onDragEnd(span: Span) {
      dispatch(setOuterTimeWindow(span))
      dispatch(fetchMainSearch())
    }

    function onSelection(span: Span) {
      dispatch(setInnerTimeWindow(null))
      dispatch(setOuterTimeWindow(span))
      dispatch(fetchMainSearch())
    }

    function onFocus(span: Span) {
      dispatch(setInnerTimeWindow(span))
      dispatch(fetchMainSearch({saveToHistory: false}))
    }

    function onBlur() {
      dispatch(setInnerTimeWindow(null))
      dispatch(fetchMainSearch({saveToHistory: false}))
    }

    function onSelectionClear() {
      dispatch(setInnerTimeWindow(null))
    }

    function onSelectionClick(span) {
      dispatch(setInnerTimeWindow(null))
      dispatch(setOuterTimeWindow(span))
      dispatch(fetchMainSearch())
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
    let data = format(resultsToLogs(search.results, "0"), span)
    let margins = {left: 0, right: 0, top: 3, bottom: 16}

    return {
      data,
      width,
      height,
      margins,
      state: {
        isFetching: search.status === "FETCHING",
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
  }, [search.results, search.status, span, innerSpan, width, height])
}
