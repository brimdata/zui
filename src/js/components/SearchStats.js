/* @flow */

import React from "react"

import {getSearchStats} from "../selectors/stats"
import * as fmt from "../lib/fmt"

type Props = {
  bytesRead: number,
  startTime: number,
  updateTime: number
}

export default class SearchStats extends React.Component<Props> {
  render() {
    const {bytesRead, startTime, updateTime} = this.props
    return (
      <div className="search-stats">
        <p>
          <span className="label">Speed:</span>
          <span className="number">
            {fmtSpeed(startTime, updateTime, bytesRead)}
          </span>
        </p>
        <p>
          <span className="label">Time:</span>
          <span className="number">{fmtDiff(startTime, updateTime)}</span>
        </p>
      </div>
    )
  }
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

import {connect} from "react-redux"

const stateToProps = (state) => ({
  ...getSearchStats(state)
})

export const XSearchStats = connect<Props, {||}, _, _, _, _>(stateToProps)(
  SearchStats
)
