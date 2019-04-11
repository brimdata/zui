/* @flow */

import {connect} from "react-redux"
import React from "react"
import * as d3 from "d3"

import type {DateTuple} from "../lib/TimeWindow"
import type {DispatchProps, State} from "../reducers/types"
import type {Interval} from "../lib/histogramInterval"
import {getHistogramData, getMainSearchHistogram} from "../reducers/histogram"
import {getHistogramStatus} from "../selectors/boomSearches"
import {getInnerTimeWindow, getTimeWindow} from "../reducers/timeWindow"
import Chart from "../charts/Chart"
import HoverLine from "../charts/elements/HoverLine"
import SVGChart from "./SVGChart"
import SingleTickYAxis from "../charts/elements/SingleTickYAxis"
import StackedPathBars from "../charts/elements/StackedPathBars"
import TimeSpanXAxis from "../charts/elements/TimeSpanXAxis"
import XAxisBrush from "../charts/elements/XAxisBrush"
import XPositionTooltip from "../charts/elements/XPositionTooltip"
import dispatchToProps from "../lib/dispatchToProps"

type OwnProps = {|
  width: number,
  height: number
|}

type StateProps = {|
  rawData: any,
  data: {ts: Date, [string]: number}[],
  timeBinCount: number,
  timeWindow: DateTuple,
  innerTimeWindow: ?DateTuple,
  interval: Interval,
  keys: string[],
  isFetching: boolean
|}

type Props = {|...StateProps, ...DispatchProps, ...OwnProps|}

function buildHistogramChart(props) {
  return new Chart({
    props: props,
    builders: {
      data: buildData,
      margins: buildMargins,
      dimens: buildDimens,
      scales: buildScales
    },
    elements: [
      new TimeSpanXAxis(props.dispatch),
      new StackedPathBars(props.dispatch),
      new SingleTickYAxis(props.dispatch),
      new XAxisBrush(props.dispatch),
      new HoverLine(),
      new XPositionTooltip()
    ]
  })
}
export default class Histogram extends React.Component<Props> {
  chart: Chart

  constructor(props: Props) {
    super(props)
    this.chart = buildHistogramChart(props)
  }

  render() {
    this.chart.update(this.props)
    return (
      <SVGChart
        className="main-search-histogram"
        chart={this.chart}
        isFetching={this.props.isFetching}
        isEmpty={this.chart.data.data.length === 0}
      />
    )
  }
}

const buildData = ({props}) => ({
  ...props
})

const buildMargins = (_) => ({
  left: 0,
  right: 0,
  top: 12,
  bottom: 24
})

const buildDimens = ({props, margins}) => ({
  width: props.width,
  height: props.height,
  innerWidth: Math.max(props.width - margins.left - margins.right, 0),
  innerHeight: Math.max(props.height - margins.top - margins.bottom, 0)
})

const buildScales = ({data, dimens}) => {
  const max = d3.max(data.data, (d) => d.count) || 0
  const xDomain = [] // Filled with fake values
  for (let i = 0; i < data.timeBinCount; ++i) xDomain.push(i)

  return {
    xScale: d3
      .scaleBand()
      .rangeRound([0, dimens.innerWidth])
      .domain(xDomain),
    yScale: d3
      .scaleLinear()
      .range([dimens.innerHeight, 0])
      .domain([0, max]),
    timeScale: d3
      .scaleUtc()
      .range([0, dimens.innerWidth])
      .domain(data.timeWindow)
  }
}

const stateToProps = (state: State) => ({
  rawData: getHistogramData(state),
  ...getMainSearchHistogram(state),
  timeWindow: getTimeWindow(state),
  innerTimeWindow: getInnerTimeWindow(state),
  isFetching: getHistogramStatus(state) === "FETCHING"
})

export const XHistogram = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(Histogram)
