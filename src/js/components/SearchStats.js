/* @flow */

import React from "react"

import type {SearchStats as TSearchStats} from "../state/searches/types"
import {getSearchStats} from "../state/searches/selector"
import * as fmt from "../lib/fmt"
import {reactElementProps} from "../test/integration"

type Props = {
  stats?: TSearchStats
}

export default class SearchStats extends React.Component<Props> {
  render() {
    const {bytesRead, startTime, updateTime} = this.props.stats || {}
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
  stats: getSearchStats(state, "ViewerSearch")
})

export const XSearchStats = connect<Props, {||}, _, _, _, _>(stateToProps)(
  SearchStats
)
