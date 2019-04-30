/* @flow */

import {connect} from "react-redux"
import React from "react"

import type {DateTuple} from "../lib/TimeWindow"
import type {DispatchProps, State} from "../state/types"
import type {SearchResults} from "../state/searches/types"
import {buildMainHistogramChart} from "../charts/mainHistogram"
import {getInnerTimeWindow, getTimeWindow} from "../state/reducers/timeWindow"
import {getSearch, getSearchStatus} from "../state/searches/selector"
import {resultsToLogs} from "../log/resultsToLogs"
import Chart from "../charts/Chart"
import SVGChart from "./SVGChart"
import dispatchToProps from "../lib/dispatchToProps"

type OwnProps = {|
  width: number,
  height: number
|}

type StateProps = {|
  results: SearchResults,
  timeWindow: DateTuple,
  innerTimeWindow: ?DateTuple,
  isFetching: boolean
|}

type Props = {|...StateProps, ...DispatchProps, ...OwnProps|}

function stateToProps(state: State): StateProps {
  return {
    results: getSearch(state, "HistogramSearch").results,
    timeWindow: getTimeWindow(state),
    innerTimeWindow: getInnerTimeWindow(state),
    isFetching: getSearchStatus(state, "HistogramSearch") === "FETCHING"
  }
}

function getChartProps(props: Props) {
  return {
    logs: resultsToLogs(props.results, "0"),
    timeWindow: props.timeWindow,
    innerTimeWindow: props.innerTimeWindow,
    dispatch: props.dispatch,
    height: props.height,
    width: props.width
  }
}

export default class Histogram extends React.Component<Props> {
  chart: Chart

  constructor(props: Props) {
    super(props)
    this.chart = buildMainHistogramChart(getChartProps(props))
  }

  render() {
    this.chart.update(getChartProps(this.props))
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

export const XHistogram = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(Histogram)
