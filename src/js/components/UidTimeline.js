/* @flow */

import {connect} from "react-redux"
import React from "react"
import * as d3 from "d3"
import isEqual from "lodash/isEqual"

import type {DispatchProps} from "../reducers/types"
import {viewLogDetail} from "../actions/logDetails"
import Log from "../models/Log"
import * as Time from "../lib/Time"
import * as TimeField from "../lib/TimeField"
import * as TimeWindow from "../lib/TimeWindow"
import dispatchToProps from "../lib/dispatchToProps"

type OwnProps = {|
  logs: Log[],
  log: Log
|}

type Props = {|
  ...DispatchProps,
  ...OwnProps
|}

export default class UidTimeline extends React.Component<Props> {
  row(log: Log, index: number, xScale: *) {
    const ts = TimeField.toDate(log.get("ts"))
    const position = xScale(ts)
    const isCurrent = isEqual(log, this.props.log)
    return (
      <div
        key={index}
        className="waterfall-row"
        onClick={() => this.props.dispatch(viewLogDetail(log))}
      >
        <div className="ts-label">{Time.format(ts, "HH:mm:ss.SSS")}</div>
        <div className="slider">
          <div className="line" />
          <span
            className={`path-tag ${log.get("_path")}-bg-color ${
              isCurrent ? "current" : ""
            }`}
            style={{left: position + "%"}}
          >
            {log.get("_path")}
          </span>
        </div>
      </div>
    )
  }

  render() {
    if (this.props.logs.length === 0) return null

    const extent = d3.extent(this.props.logs.map(l => l.cast("ts")))
    const xScale = d3
      .scaleTime()
      .domain(extent)
      .range([0, 100])

    const duration = TimeWindow.duration(extent, "seconds")

    return (
      <div className="uid-waterfall">
        {this.props.logs.map((log, i) => this.row(log, i, xScale))}
        <p className="duration">Duration: {duration}s</p>
      </div>
    )
  }
}

export const XUidTimeline = connect<Props, OwnProps, _, DispatchProps, _, _>(
  null,
  dispatchToProps
)(UidTimeline)
