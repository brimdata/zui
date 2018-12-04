import React from "react"
import * as fmt from "../lib/fmt"

const SearchStats = ({
  tuplesMatched,
  tuplesRead,
  _bytesMatched,
  bytesRead,
  startTime,
  updateTime
}) => (
  <div className="search-stats">
    <p>
      <span className="label">Matched:</span>
      <span className="number">{fmt.withCommas(tuplesMatched)}</span>
    </p>
    <p>
      <span className="label">Read:</span>
      <span className="number">{fmt.withCommas(tuplesRead)}</span>
    </p>
    <p>
      <span className="label">Time:</span>
      <span className="number">{fmtDiff(startTime, updateTime)}</span>
    </p>
    <p>
      <span className="label">Speed:</span>
      <span className="number">
        {fmtSpeed(startTime, updateTime, bytesRead)}
      </span>
    </p>
  </div>
)

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

export default SearchStats
