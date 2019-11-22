/* @flow */
import React, {useMemo} from "react"
import * as d3 from "d3"

import type {DateTuple} from "../../lib/TimeWindow"
import type {SearchResults} from "../../state/searches/types"
import {innerHeight, innerWidth} from "../dimens"
import {resultsToLogs} from "../../log/resultsToLogs"
import {withCommas} from "../../lib/fmt"
import EmptyMessage from "../../components/EmptyMessage"
import HistogramTooltip from "../../components/HistogramTooltip"
import barStacks from "../pens/barStacks"
import format from "../MainHistogram/format"
import hoverline from "../pens/hoverLine"
import reactComponent from "../pens/reactComponent"
import useConst from "../../hooks/useConst"
import xAxisTime from "../pens/xAxisTime"
import xPositionTooltip from "../pens/xPositionTooltip"
import yAxis from "../pens/yAxis"

export default function useFindingHistogram(
  width: number,
  height: number,
  results: SearchResults,
  span: DateTuple
) {
  let data = format(resultsToLogs(results, "0"), span)
  let max = d3.max(data.points, (d) => d.count) || 0

  let margins = {
    left: 14 + withCommas(max).length * 5,
    right: 0,
    top: 4,
    bottom: 16
  }

  let pens = useConst([], () => [
    barStacks(),
    xAxisTime(),
    yAxis(),
    hoverline(),
    reactComponent((chart) => <EmptyMessage show={chart.state.isEmpty} />),
    xPositionTooltip({
      wrapperClassName: "histogram-tooltip-wrapper",
      render: HistogramTooltip
    })
  ])

  return useMemo(() => {
    return {
      data,
      margins,
      width,
      height,
      state: {isEmpty: data.points.length === 0},
      yScale: d3
        .scaleLinear()
        .range([innerHeight(height, margins), 0])
        .domain([0, max]),
      xScale: d3
        .scaleUtc()
        .range([0, innerWidth(width, margins)])
        .domain(span),
      pens
    }
  }, [width, height, results, span])
}
