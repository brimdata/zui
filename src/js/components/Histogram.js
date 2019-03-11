/* @flow */

import {connect} from "react-redux"
import React from "react"
import classNames from "classnames"
import * as d3 from "d3"
import isEqual from "lodash/isEqual"

import type {DateTuple} from "../lib/TimeWindow"
import {type DispatchProps, type State} from "../reducers/types"
import {Fieldset} from "./Typography"
import {type Interval} from "../lib/countByTimeInterval"
import {getHistogramStatus} from "../selectors/boomSearches"
import {getInnerTimeWindow, getTimeWindow} from "../reducers/timeWindow"
import {
  getMainSearchCountByTime,
  getCountByTimeData
} from "../reducers/countByTime"
import Chart from "../models/Chart"
import HoverLine from "../charts/HoverLine"
import LoadingMessage from "./LoadingMessage"
import SingleTickYAxis from "../charts/SingleTickYAxis"
import StackedPathBars from "../charts/StackedPathBars"
import TimeSpanXAxis from "../charts/TimeSpanXAxis"
import XAxisBrush from "../charts/XAxisBrush"
import XPositionTooltip from "../charts/XPositionTooltip"
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
  innerTimeWindow: DateTuple,
  interval: Interval,
  keys: string[],
  isFetching: boolean
|}

type Props = {|...StateProps, ...DispatchProps, ...OwnProps|}

export default class Histogram extends React.Component<Props> {
  svg: any
  chart: Chart

  constructor(props: Props) {
    super(props)
    this.chart = new Chart({
      props: this.props,
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

  shouldComponentUpdate(nextProps: Props) {
    const {rawData, width, height, timeWindow, innerTimeWindow} = this.props
    return (
      nextProps.rawData !== rawData ||
      nextProps.width !== width ||
      nextProps.height !== height ||
      !isEqual(timeWindow, nextProps.timeWindow) ||
      !isEqual(innerTimeWindow, nextProps.innerTimeWindow) ||
      this.props.isFetching !== nextProps.isFetching
    )
  }

  componentDidMount() {
    this.chart.mount(this.svg)
    this.chart.draw()
  }

  componentDidUpdate() {
    this.chart.update(this.props)
    this.chart.draw()
  }

  render() {
    const {width, height, isFetching} = this.props
    const noResults = !isFetching && this.chart.data.data.length === 0
    return (
      <div className="count-by-time-wrapper loading" style={{width, height}}>
        <div id="histogram-tooltip" />
        <LoadingMessage show={this.props.isFetching} message="Loading Chart" />
        <Fieldset className={classNames("no-chart-data", {visible: noResults})}>
          No Chart Data
        </Fieldset>
        <svg
          className="count-by-time"
          height={this.props.height}
          width={this.props.width}
          ref={r => (this.svg = r)}
        />
      </div>
    )
  }
}

const buildData = ({props}) => ({
  ...props
})

const buildMargins = _ => ({
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
  const max = d3.max(data.data, d => d.count) || 0
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
  rawData: getCountByTimeData(state),
  ...getMainSearchCountByTime(state),
  timeWindow: getTimeWindow(state),
  innerTimeWindow: getInnerTimeWindow(state),
  isFetching: getHistogramStatus(state) === "FETCHING"
})

export const XHistogram = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(Histogram)
