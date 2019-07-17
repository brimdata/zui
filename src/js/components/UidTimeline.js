/* @flow */

import {connect} from "react-redux"
import React from "react"
import classNames from "classnames"
import * as d3 from "d3"
import isEqual from "lodash/isEqual"

import type {DispatchProps} from "../state/types"
import {add, format} from "../lib/Time"
import {viewLogDetail} from "../detail/viewLogDetail"
import Log from "../models/Log"
import dispatchToProps from "../lib/dispatchToProps"

type OwnProps = {|
  logs: Log[],
  log: Log
|}

type Props = {|
  ...DispatchProps,
  ...OwnProps
|}

export default function UidTimeline({logs, log, dispatch}: Props) {
  if (logs.length === 0) return null
  let xScale = createScale(logs)

  return (
    <div className="uid-waterfall">
      {logs.map((currLog, i) => (
        <PathRow
          key={i}
          log={currLog}
          current={isEqual(currLog, log)}
          position={xScale(currLog.cast("ts"))}
          onClick={() => dispatch(viewLogDetail(currLog))}
        />
      ))}
      <Duration conn={logs.find((l) => l.get("_path") === "conn")} />
    </div>
  )
}

function createScale(logs) {
  let tss = []

  for (let log of logs) {
    tss.push(log.cast("ts"))
  }

  let [start, end] = d3.extent(tss)
  if (start === end) end = add(start, 1, "ms")

  return d3
    .scaleTime()
    .domain([start, end])
    .range([0, 100])
}

function PathRow({log, current, position, ...rest}) {
  let ts = log.cast("ts")
  let path = log.get("_path")
  return (
    <div className="waterfall-row" {...rest}>
      <div className="ts-label">{format(ts, "HH:mm:ss.SSS")}</div>
      <div className="slider">
        <div className="line" />
        <span
          className={classNames("path-tag", `${path}-bg-color`, {current})}
          style={{left: position + "%"}}
        >
          {path}
        </span>
      </div>
    </div>
  )
}

function Duration({conn}) {
  if (conn) {
    return <p className="duration">Duration: {conn.cast("duration") || 0}s</p>
  } else {
    return <p className="duration">Duration: 0s (No conn log)</p>
  }
}

export const XUidTimeline = connect<Props, OwnProps, _, DispatchProps, _, _>(
  null,
  dispatchToProps
)(UidTimeline)
