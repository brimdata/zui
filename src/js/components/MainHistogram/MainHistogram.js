/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useMemo} from "react"
import * as d3 from "d3"

import type {ChartSVG, HistogramChart} from "../../charts/types"
import {getHistogramSearch} from "../../state/searches/selector"
import {
  getInnerTimeWindow,
  getTimeWindow
} from "../../state/reducers/timeWindow"
import {innerHeight, innerWidth} from "../../charts/dimens"
import {resultsToLogs} from "../../log/resultsToLogs"
import D3Chart from "../D3Chart"
import buildElements from "./buildElements"
import formatMainHistogramData from "./formatMainHistogramData"

export default function MainSearchHistogram() {
  let search = useSelector(getHistogramSearch)
  if (!search) return null
  let logs = useMemo(() => resultsToLogs(search.results, "0"), [search.results])
  let span = useSelector(getTimeWindow)
  let innerSpan = useSelector(getInnerTimeWindow)
  let isFetching = search.status === "FETCHING"
  let dispatch = useDispatch()
  let data = useMemo(() => formatMainHistogramData(logs, span), [logs, span])

  return <MainHistogramD3 {...{data, span, innerSpan, isFetching, dispatch}} />
}

type Props = {}

const MainHistogramD3 = React.memo<Props>(function MainHistogramD3(props) {
  let {data, span, innerSpan, isFetching, dispatch} = props

  function buildChart(svg: ChartSVG): HistogramChart {
    let chart = {...svg}
    return {
      ...chart,
      data,
      state: {
        selection: innerSpan,
        isFetching,
        isEmpty: data.points.length === 0
      },
      yScale: d3
        .scaleLinear()
        .range([innerHeight(chart), 0])
        .domain([0, d3.max(data.points, (d) => d.count) || 0]),
      xScale: d3
        .scaleUtc()
        .range([0, innerWidth(chart)])
        .domain(span)
    }
  }
  return (
    <D3Chart
      className="main-search-histogram"
      margins={{left: 0, right: 0, top: 3, bottom: 16}}
      buildChart={buildChart}
      buildElements={buildElements(dispatch)}
    />
  )
})
