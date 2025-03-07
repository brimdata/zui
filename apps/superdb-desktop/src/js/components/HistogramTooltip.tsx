import React from "react"
import time from "../models/time"

import * as fmt from "../lib/fmt"

type Props = {
  ts: Date
  segments: [string, number][]
  chart: any
}

const HistogramTooltip = ({chart, segments, ts}: Props) => {
  const total = segments.reduce((sum, [_, count]) => (sum += count), 0)
  const rows = segments
    .sort((a, b) => b[1] - a[1])
    .map(([path, count]) => (
      <tr key={path}>
        <td>
          <span
            className={`tag path-tag`}
            style={{backgroundColor: chart.color(path)}}
          >
            {path.substring(0, 30)}
          </span>
        </td>
        <td className="count">{fmt.withCommas(count)}</td>
      </tr>
    ))
  return (
    <div className="histogram-tooltip">
      <p className="ts">{time(ts).format("MMM D, YYYY • HH:mm")}</p>
      <table>
        <tbody>
          {rows}
          <tr>
            <td colSpan={2} className="total-row">
              {fmt.withCommas(total)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default HistogramTooltip
