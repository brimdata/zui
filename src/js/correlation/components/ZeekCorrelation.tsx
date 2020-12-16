import React from "react"
import classNames from "classnames"
import * as d3 from "d3"
import isEqual from "lodash/isEqual"
import {zng} from "zealot"
import brim from "../../brim"
import {createZeekLog} from "../../brim/zeekLog"
import {submitSearch} from "../../flows/submitSearch/mod"
import {viewLogDetail} from "../../flows/viewLogDetail"
import {UID_CORRELATION_LIMIT} from "../../searches/programs"
import SearchBar from "../../state/SearchBar"
import {BrimEvent} from "../models/BrimEvent"
import {sort} from "../util/sort"
import {useDispatch} from "react-redux"

type Props = {
  logs: zng.Record[]
  log: zng.Record
}

export default function ZeekCorrelation({logs, log}: Props) {
  const dispatch = useDispatch()
  if (logs.length === 0) return null
  const zeek = createZeekLog(log)
  const xScale = createScale(logs)
  function queryForAll() {
    dispatch(SearchBar.clearSearchBar())
    dispatch(SearchBar.changeSearchBarInput(zeek.correlationId()))
    dispatch(submitSearch())
  }

  return (
    <div className="uid-waterfall">
      {sort(logs).map((currLog, i) => (
        <PathRow
          key={i}
          log={currLog}
          current={isEqual(currLog, log)}
          position={xScale((currLog.get("ts") as zng.Primitive).toDate())}
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
    tss.push(log.get("ts").toDate())
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
  const event = BrimEvent.build(log)
  const ts = event.getTime()
  const type = event.getType()
  return (
    <div className="waterfall-row" {...rest}>
      <div className="data-label">{brim.time(ts).format("HH:mm:ss.SSS")}</div>
      <div className="slider">
        <div className="line" />
        <span
          className={classNames("path-tag", `${type}-bg-color`, {current})}
          style={{left: position + "%"}}
        >
          {type}
        </span>
      </div>
    </div>
  )
}

function captionText(logs: zng.Record[], queryForAll) {
  const limit = logs.length === UID_CORRELATION_LIMIT
  const conn = logs.find((l) => l.try("_path")?.toString() === "conn")
  if (limit)
    return (
      <>
        Limited to 100 events. <a onClick={queryForAll}>Query for all.</a>
      </>
    )
  else if (conn && conn.has("duration")) {
    const dur = conn.get("duration") as zng.Primitive
    return `Duration: ${dur.isSet() ? dur.toFloat() : 0}s`
  } else {
    return "Duration: 0s (No conn log)"
  }
}
