import {connect} from "react-redux"
import React from "react"
import classNames from "classnames"
import * as d3 from "d3"
import isEqual from "lodash/isEqual"

import {DispatchProps} from "../state/types"
import {UID_CORRELATION_LIMIT} from "../searches/programs"
import {submitSearch} from "../flows/submitSearch/mod"
import {viewLogDetail} from "../flows/viewLogDetail"
import Log from "../models/Log"
import SearchBar from "../state/SearchBar"
import brim from "../brim"
import dispatchToProps from "../lib/dispatchToProps"

type OwnProps = {
  logs: Log[]
  log: Log
}

type Props = DispatchProps & OwnProps

export default function UidTimeline({logs, log, dispatch}: Props) {
  if (logs.length === 0) return null

  const xScale = createScale(logs)

  function queryForAll() {
    dispatch(SearchBar.clearSearchBar())
    dispatch(SearchBar.changeSearchBarInput(log.correlationId()))
    dispatch(submitSearch())
  }

  return (
    <div className="uid-waterfall">
      {logs.map((currLog, i) => (
        <PathRow
          key={i}
          log={currLog}
          current={isEqual(currLog, log)}
          position={xScale(currLog.cast("ts") as Date)}
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
  const tss = []

  for (const log of logs) {
    tss.push(log.cast("ts"))
  }

  let [start, end] = d3.extent(tss)
  if (start === end)
    end = brim
      .time(start)
      .add(1, "ms")
      .toDate()

  return d3
    .scaleTime()
    .domain([start, end])
    .range([0, 100])
}

function PathRow({log, current, position, ...rest}) {
  const ts = log.cast("ts")
  const path = log.getString("_path")
  return (
    <div className="waterfall-row" {...rest}>
      <div className="data-label">{brim.time(ts).format("HH:mm:ss.SSS")}</div>
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
  const limit = logs.length === UID_CORRELATION_LIMIT
  const conn = logs.find((l) => l.getString("_path") === "conn")

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

export const XUidTimeline = connect(null, dispatchToProps)(UidTimeline)
