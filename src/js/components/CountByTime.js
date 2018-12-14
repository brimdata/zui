/* @flow */

import React from "react"
import * as d3 from "d3"
import type {DateTuple} from "../lib/TimeWindow"
import TimeSpanXAxis from "../charts/TimeSpanXAxis"
import SingleTickYAxis from "../charts/SingleTickYAxis"
import HistogramBrush from "../charts/HistogramBrush"
import StackedPathBars from "../charts/StackedPathBars"
import Chart from "../models/Chart"
import HistogramTooltip from "./HistogramTooltip"

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

export default class CountByTime extends React.Component<Props> {
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
        new SingleTickYAxis(props.dispatch),
        new StackedPathBars(props.dispatch),
        new HistogramBrush(props.dispatch)
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
  timeWindow: props.timeWindow,
  innerTimeWindow: props.innerTimeWindow,
  data: props.data,
  keys: props.keys,
  timeBinCount: props.timeBinCount
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
      .domain(xDomain)
      .padding(0.05),
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
