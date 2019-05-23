/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React from "react"
import classNames from "classnames"

import {Fieldset} from "./Typography"
import type {Span} from "../BoomClient/types"
import {fetchMainSearch} from "../viewer/fetchMainSearch"
import {getHistogramSearch} from "../state/searches/selector"
import {getInnerTimeWindow, getTimeWindow} from "../state/reducers/timeWindow"
import {resultsToLogs} from "../log/resultsToLogs"
import {setInnerTimeWindow, setOuterTimeWindow} from "../state/actions"
import {toDate} from "../lib/TimeField"
import D3Chart from "./D3Chart"
import HistogramTooltip from "./HistogramTooltip"
import LoadingMessage from "./LoadingMessage"
import Log from "../models/Log"
import MergeHash from "../models/MergeHash"
import UniqArray from "../models/UniqArray"
import focusBar from "../charts/elements/focusBar"
import histogramInterval from "../lib/histogramInterval"
import hoverLine from "../charts/elements/hoverLine"
import reactComponent from "../charts/elements/reactComponent"
import singleTickYAxis from "../charts/elements/singleTickYAxis"
import stackedPathBars from "../charts/elements/stackedPathBars"
import timeSpanXAxis from "../charts/elements/timeSpanXAxis"
import xAxisBrush from "../charts/elements/xAxisBrush"
import xPositionTooltip from "../charts/elements/xPositionTooltip"

export default function MainSearchHistogram() {
  let search = useSelector(getHistogramSearch)
  if (!search) return null
  let logs = resultsToLogs(search.results, "0")
  let span = useSelector(getTimeWindow)
  let innerSpan = useSelector(getInnerTimeWindow)
  let isFetching = search.status === "FETCHING"
  let dispatch = useDispatch()

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

  function buildElements() {
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

  return (
    <D3Chart
      className="main-search-histogram"
      data={formatCountByPathEvery(logs, span)}
      margins={{left: 0, right: 0, top: 3, bottom: 16}}
      state={{selection: innerSpan, isFetching, isEmpty: logs.length === 0}}
      buildElements={buildElements}
    />
  )
}

export function formatCountByPathEvery(logs: Log[], span: Span) {
  let interval = histogramInterval(span)
  let keys = new UniqArray()
  let hash = new MergeHash()

  logs.forEach((log) => {
    let ts = toDate(log.get("ts"))
    let path = log.get("_path")
    let count = parseInt(log.get("count"))
    keys.push(path)
    hash.merge(ts, {[path]: count})
  })

  let defaults = keys.toArray().reduce((obj, path) => ({...obj, [path]: 0}), {})
  let table = hash.toJSON()

  let bins = Object.keys(table).map((ts) => {
    return {
      ts: new Date(ts),
      ...defaults,
      ...table[ts],
      count: Object.values(table[ts]).reduce((c, sum) => parseInt(sum) + c, 0)
    }
  })

  return {
    interval,
    span,
    points: bins,
    keys: keys.toArray()
  }
}

function EmptyMessage({show}) {
  return (
    <Fieldset className={classNames("no-chart-data", {visible: show})}>
      No Chart Data
    </Fieldset>
  )
}
