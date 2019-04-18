/* @flow */

import {connect} from "react-redux"
import React, {useState} from "react"

import type {DateTuple} from "../lib/TimeWindow"
import type {DispatchProps, State} from "../state/reducers/types"
import {buildMainHistogramChart} from "../charts/mainHistogram"
import {getHistogramData} from "../state/reducers/histogram"
import {getHistogramStatus} from "../state/selectors/boomSearches"
import {getInnerTimeWindow, getTimeWindow} from "../state/reducers/timeWindow"
import Log from "../models/Log"
import SVGChart from "./SVGChart"
import dispatchToProps from "../lib/dispatchToProps"

type OwnProps = {|
  width: number,
  height: number
|}

type StateProps = {|
  results: Log[],
  timeWindow: DateTuple,
  innerTimeWindow: ?DateTuple,
  isFetching: boolean
|}

type Props = {|...StateProps, ...DispatchProps, ...OwnProps|}

export default function Histogram(props: Props) {
  const [chart] = useState(buildMainHistogramChart(props))
  chart.update(props)
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
  results: getHistogramData(state),
  timeWindow: getTimeWindow(state),
  innerTimeWindow: getInnerTimeWindow(state),
  isFetching: getHistogramStatus(state) === "FETCHING"
})

export const XHistogram = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(Histogram)
