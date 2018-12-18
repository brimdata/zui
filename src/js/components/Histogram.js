/* @flow */

import React from "react"
import * as d3 from "d3"
import type {DateTuple} from "../lib/TimeWindow"
import TimeSpanXAxis from "../charts/TimeSpanXAxis"
import SingleTickYAxis from "../charts/SingleTickYAxis"
import XAxisBrush from "../charts/XAxisBrush"
import StackedPathBars from "../charts/StackedPathBars"
import Chart from "../models/Chart"
import XPositionTooltip from "../charts/XPositionTooltip"
import HoverLine from "../charts/HoverLine"

type Props = {
  rawData: any,
  data: {}[],
  timeBinCount: number,
  width: number,
  height: number,
  timeWindow: DateTuple,
  innerTimeWindow: DateTuple,
  keys: string[],
  dispatch: Function
}

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
    const {rawData, width, height} = this.props
    return (
      nextProps.rawData !== rawData ||
      nextProps.width !== width ||
      nextProps.height !== height
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
    return (
      <div className="count-by-time-wrapper">
        <div id="histogram-tooltip" />

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

import {connect} from "react-redux"
import {bindActionCreators} from "redux"
import * as actions from "../actions/timeWindow"
import {fetchMainSearch} from "../actions/mainSearch"
import {
  getMainSearchCountByTime,
  getCountByTimeData
} from "../reducers/countByTime"
import {getInnerTimeWindow, getTimeWindow} from "../reducers/timeWindow"

const stateToProps = state => ({
  rawData: getCountByTimeData(state),
  ...getMainSearchCountByTime(state),
  timeWindow: getTimeWindow(state),
  innerTimeWindow: getInnerTimeWindow(state)
})

export const XHistogram = connect(
  stateToProps,
  (dispatch: Function) => ({
    dispatch: dispatch,
    ...bindActionCreators({...actions, fetchMainSearch}, dispatch)
  })
)(Histogram)
