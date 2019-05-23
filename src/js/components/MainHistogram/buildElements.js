/* @flow */

import React from "react"

import type {ChartElement} from "../../charts/types"
import type {Dispatch} from "../../state/types"
import type {Span} from "../../BoomClient/types"
import {fetchMainSearch} from "../../viewer/fetchMainSearch"
import {setInnerTimeWindow, setOuterTimeWindow} from "../../state/actions"
import EmptyMessage from "../EmptyMessage"
import HistogramTooltip from "../HistogramTooltip"
import LoadingMessage from "../LoadingMessage"
import focusBar from "../../charts/elements/focusBar"
import hoverLine from "../../charts/elements/hoverLine"
import reactComponent from "../../charts/elements/reactComponent"
import singleTickYAxis from "../../charts/elements/singleTickYAxis"
import stackedPathBars from "../../charts/elements/stackedPathBars"
import timeSpanXAxis from "../../charts/elements/timeSpanXAxis"
import xAxisBrush from "../../charts/elements/xAxisBrush"
import xPositionTooltip from "../../charts/elements/xPositionTooltip"

export default function buildElements(dispatch: Dispatch) {
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

  return function(): ChartElement[] {
    return [
      timeSpanXAxis({onDragEnd}),
      stackedPathBars(),
      singleTickYAxis(),
      xAxisBrush({onSelection, onSelectionClear, onSelectionClick}),
      hoverLine(),
      reactComponent((chart) => (
        <LoadingMessage show={chart.state.isFetching} message="Chart Loading" />
      )),
      reactComponent((chart) => (
        <EmptyMessage show={!chart.state.isFetching && chart.state.isEmpty} />
      )),
      xPositionTooltip({
        wrapperClassName: "histogram-tooltip-wrapper",
        render: HistogramTooltip
      }),
      focusBar({onFocus, onBlur})
    ]
  }
}
