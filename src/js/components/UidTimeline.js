/* @flow */

import {connect} from "react-redux"
import React from "react"
import classNames from "classnames"
import * as d3 from "d3"
import isEqual from "lodash/isEqual"

import type {DispatchProps} from "../state/types"
import {UID_CORRELATION_LIMIT} from "../detail/correlations"
import {add, format} from "../lib/Time"
import {changeSearchBarInput, clearSearchBar} from "../state/actions"
import {submitSearchBar} from "../state/thunks/searchBar"
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

  function queryForAll() {
    dispatch(clearSearchBar())
    dispatch(changeSearchBarInput(log.correlationId()))
    dispatch(submitSearchBar())
  }

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
      <div className="caption">
        <p className="data-label">{captionText(logs, queryForAll)}</p>
      </div>
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
      <div className="data-label">{format(ts, "HH:mm:ss.SSS")}</div>
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

function captionText(logs: Log[], queryForAll) {
  let limit = logs.length === UID_CORRELATION_LIMIT
  let conn = logs.find((l) => l.get("_path") === "conn")

  if (limit)
    return (
      <>
        Limited to 100 events. <a onClick={queryForAll}>Query for all.</a>
      </>
    )
  else if (conn) {
    return `Duration: ${conn.cast("duration") || 0}s`
  } else {
    return "Duration: 0s (No conn log)"
  }
}

export const XUidTimeline = connect<Props, OwnProps, _, DispatchProps, _, _>(
  null,
  dispatchToProps
)(UidTimeline)
