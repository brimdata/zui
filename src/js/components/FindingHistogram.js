/* @flow */

import React, {useMemo} from "react"
import * as d3 from "d3"

import type {ChartSVG, HistogramChart} from "../charts/types"
import type {Span} from "../BoomClient/types"
import {innerHeight, innerWidth} from "../charts/dimens"
import {withCommas} from "../lib/fmt"
import D3Chart from "./D3Chart"
import EmptyMessage from "./EmptyMessage"
import HistogramTooltip from "./HistogramTooltip"
import Log from "../models/Log"
import formatMainHistogramData from "./MainHistogram/formatMainHistogramData"
import hoverline from "../charts/elements/hoverLine"
import reactComponent from "../charts/elements/reactComponent"
import stackedPathBars from "../charts/elements/stackedPathBars"
import timeSpanXAxis from "../charts/elements/timeSpanXAxis"
import xPositionTooltip from "../charts/elements/xPositionTooltip"
import yAxis from "../charts/elements/yAxis"

type Props = {
  logs: Log[],
  span: Span
}

export default function FindingHistogram({logs, span}: Props) {
  let data = formatMainHistogramData(logs, span)
  let max = d3.max(data.points, (d) => d.count) || 0
  let margins = {
    left: 14 + withCommas(max).length * 5,
    right: 0,
    top: 4,
    bottom: 16
  }
  let elements = useMemo(
    () => [
      stackedPathBars(),
      timeSpanXAxis(),
      yAxis(),
      hoverline(),
      reactComponent((chart) => <EmptyMessage show={chart.state.isEmpty} />),
      xPositionTooltip({
        wrapperClassName: "histogram-tooltip-wrapper",
        render: HistogramTooltip
      })
    ],
    []
  )

  function buildChart(svg: ChartSVG): HistogramChart {
    let chart = {...svg}
    return {
      ...chart,
      data,
      state: {isEmpty: logs.length === 0},
      yScale: d3
        .scaleLinear()
        .range([innerHeight(chart), 0])
        .domain([0, max]),
      xScale: d3
        .scaleUtc()
        .range([0, innerWidth(chart)])
        .domain(span),
      elements
    }
  }

  return (
    <D3Chart
      className="finding-histogram"
      margins={margins}
      buildChart={buildChart}
    />
  )
}
