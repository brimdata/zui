/* @flow */

import {useSelector} from "react-redux"
import React from "react"

import {reactElementProps} from "../test/integration"
import Viewer from "../state/viewer"
import * as fmt from "../lib/fmt"

export default function TableSearchStatus() {
  let stats = useSelector(Viewer.getStats) || {}

  const {bytesRead, startTime, updateTime} = stats
  return (
    <div className="search-stats">
      <p>
        <span className="label">Speed:</span>
        <span className="number" {...reactElementProps("search_speed")}>
          {fmtSpeed(startTime, updateTime, bytesRead)}
        </span>
      </p>
      <p>
        <span className="label">Time:</span>
        <span className="number" {...reactElementProps("search_time")}>
          {fmtDiff(startTime, updateTime)}
        </span>
      </p>
    </div>
  )
}

function duration(start, update) {
  return update - start
}

const fmtDiff = (startTime, updateTime) => {
  if (!startTime || !updateTime) return "0s"
  return duration(startTime, updateTime).toFixed(3) + " s"
}

const elapsedSeconds = (startTime, updateTime) => {
  if (!startTime || !updateTime) return 0
  return duration(startTime, updateTime)
}

const fmtSpeed = (startTime, updateTime, bytesRead) => {
  if (!startTime || !updateTime || !bytesRead) return "0 B/s"
  return fmt.bytes(bytesRead / elapsedSeconds(startTime, updateTime)) + "/s"
}
