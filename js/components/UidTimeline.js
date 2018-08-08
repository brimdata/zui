import React from "react"
import * as d3 from "d3"
import config from "../config"
import moment from "moment"

export default class UidWaterfall extends React.Component {
  row(log, index, xScale) {
    const position = xScale(log.cast("ts"))
    const isCurrent = log === this.props.log
    return (
      <div key={index} className="waterfall-row">
        <div className="ts-label">
          {moment(log.cast("ts"))
            .utc()
            .format(config.TIME_MOMENT_FORMAT)}
        </div>
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

    const duration = moment(extent[1]).diff(moment(extent[0]), "seconds", true)

    return (
      <div className="uid-waterfall">
        {this.props.logs.map((log, i) => this.row(log, i, xScale))}
        <p className="duration">Duration: {duration}s</p>
      </div>
    )
  }
}
