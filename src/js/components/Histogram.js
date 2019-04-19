/* @flow */

import {connect} from "react-redux"
import React, {useState} from "react"

import type {DateTuple} from "../lib/TimeWindow"
import type {DispatchProps, State} from "../state/reducers/types"
import type {SearchResults} from "../state/searches/types"
import {buildMainHistogramChart} from "../charts/mainHistogram"
import {getInnerTimeWindow, getTimeWindow} from "../state/reducers/timeWindow"
import {getSearch, getSearchStatus} from "../state/searches/selector"
import {resultsToLogs} from "../log/resultsToLogs"
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

export default function Histogram(props: Props) {
  let chartProps = {
    logs: resultsToLogs(props.results, "0"),
    timeWindow: props.timeWindow,
    innerTimeWindow: props.innerTimeWindow,
    dispatch: props.dispatch,
    height: props.height,
    width: props.width
  }

  const [chart] = useState(buildMainHistogramChart(chartProps))
  chart.update(chartProps)

  return (
    <SVGChart
      className="main-search-histogram"
      chart={chart}
      isFetching={props.isFetching}
      isEmpty={chart.data.data.length === 0}
    />
  )
}

const stateToProps = (state: State) => ({
  results: getSearch(state, "HistogramSearch").results,
  timeWindow: getTimeWindow(state),
  innerTimeWindow: getInnerTimeWindow(state),
  isFetching: getSearchStatus(state, "HistogramSearch") === "FETCHING"
})

export const XHistogram = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(Histogram)
