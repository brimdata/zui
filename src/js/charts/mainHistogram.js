/* @flow */
import * as d3 from "d3"

import type {Dispatch} from "../state/types"
import type {Span} from "../BoomClient/types"
import {createHistogramData} from "./createHistogramData"
import {fetchMainSearch} from "../viewer/fetchMainSearch"
import {fillWithIndex} from "../lib/Array"
import {setInnerTimeWindow, setOuterTimeWindow} from "../state/actions"
import Chart from "./Chart"
import Log from "../models/Log"
import focusBar from "./elements/focusBar"
import hoverLine from "./elements/hoverLine"
import singleTickYAxis from "./elements/singleTickYAxis"
import stackedPathBars from "./elements/stackedPathBars"
import timeSpanXAxis from "./elements/timeSpanXAxis"
import xAxisBrush from "./elements/xAxisBrush"
import xPositionTooltip from "./elements/xPositionTooltip"

type Props = {
  dispatch: Dispatch,
  logs: Log[],
  timeWindow: Span,
  width: number,
  height: number
}

export function buildMainHistogramChart({dispatch, ...props}: Props) {
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

  return new Chart({
    props: props,
    builders: {
      data: ({props}) => createHistogramData(props.logs, props.timeWindow),
      margins: (_) => ({left: 0, right: 0, top: 12, bottom: 24}),
      dimens: ({props, margins}) => ({
        width: props.width,
        height: props.height,
        innerWidth: Math.max(props.width - margins.left - margins.right, 0),
        innerHeight: Math.max(props.height - margins.top - margins.bottom, 0)
      }),
      scales: ({data, dimens, props}) => ({
        yScale: d3
          .scaleLinear()
          .range([dimens.innerHeight, 0])
          .domain([0, d3.max(data.data, (d) => d.count) || 0]),
        xScale: d3
          .scaleUtc()
          .range([0, dimens.innerWidth])
          .domain(props.timeWindow)
      })
    },
    elements: [
      timeSpanXAxis({onDragEnd}),
      stackedPathBars(),
      singleTickYAxis(),
      xAxisBrush({onSelection, onSelectionClear, onSelectionClick}),
      hoverLine(),
      xPositionTooltip(),
      focusBar({onFocus, onBlur})
    ]
  })
}
