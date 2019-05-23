/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React from "react"
import * as d3 from "d3"

import type {ChartSVG, HistogramChart} from "../../charts/types"
import {getHistogramSearch} from "../../state/searches/selector"
import {
  getInnerTimeWindow,
  getTimeWindow
} from "../../state/reducers/timeWindow"
import {resultsToLogs} from "../../log/resultsToLogs"
import D3Chart from "../D3Chart"
import buildElements from "./buildElements"
import formatMainHistogramData from "./formatMainHistogramData"

export default function MainSearchHistogram() {
  let search = useSelector(getHistogramSearch)
  if (!search) return null
  let logs = resultsToLogs(search.results, "0")
  let span = useSelector(getTimeWindow)
  let innerSpan = useSelector(getInnerTimeWindow)
  let isFetching = search.status === "FETCHING"
  let dispatch = useDispatch()

  let data = formatMainHistogramData(logs, span)
  let margins = {left: 0, right: 0, top: 3, bottom: 16}

  function buildChart(svg: ChartSVG): HistogramChart {
    return {
      ...svg,
      data,
      state: {selection: innerSpan, isFetching, isEmpty: logs.length === 0},
      yScale: d3
        .scaleLinear()
        .range([svg.dimens.innerHeight, 0])
        .domain([0, d3.max(data.points, (d) => d.count) || 0]),
      xScale: d3
        .scaleUtc()
        .range([0, svg.dimens.innerWidth])
        .domain(span)
    }
  }

  return (
    <D3Chart
      className="main-search-histogram"
      margins={margins}
      buildChart={buildChart}
      buildElements={buildElements(dispatch)}
    />
  )
}
