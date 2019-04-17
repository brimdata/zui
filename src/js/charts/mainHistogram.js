/* @flow */
import * as d3 from "d3"

import type {Dispatch} from "../state/reducers/types"
import type {Results} from "../types"
import type {Span} from "../BoomClient/types"
import {createHistogramData} from "./createHistogramData"
import {fetchMainSearch} from "../state/thunks/mainSearch"
import {fillWithIndex} from "../lib/Array"
import {setInnerTimeWindow, setOuterTimeWindow} from "../state/actions"
import Chart from "./Chart"
import focusBar from "./elements/focusBar"
import hoverLine from "./elements/hoverLine"
import singleTickYAxis from "./elements/singleTickYAxis"
import stackedPathBars from "./elements/stackedPathBars"
import timeSpanXAxis from "./elements/timeSpanXAxis"
import xAxisBrush from "./elements/xAxisBrush"
import xPositionTooltip from "./elements/xPositionTooltip"

type Props = {
  dispatch: Dispatch,
  results: Results,
  timeWindow: Span
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

  function onBarClick(span: Span) {
    dispatch(setInnerTimeWindow(span))
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
      data: ({props}) => createHistogramData(props.results, props.timeWindow),
      margins: (_) => ({left: 0, right: 0, top: 12, bottom: 24}),
      dimens: ({props, margins}) => ({
        width: props.width,
        height: props.height,
        innerWidth: Math.max(props.width - margins.left - margins.right, 0),
        innerHeight: Math.max(props.height - margins.top - margins.bottom, 0)
      }),
      scales: ({data, dimens, props}) => ({
        xScale: d3
          .scaleBand()
          .rangeRound([0, dimens.innerWidth])
          .domain(fillWithIndex(data.timeBinCount)),
        yScale: d3
          .scaleLinear()
          .range([dimens.innerHeight, 0])
          .domain([0, d3.max(data.data, (d) => d.count) || 0]),
        timeScale: d3
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
      focusBar({onBarClick})
    ]
  })
}
