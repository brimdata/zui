import React from "react"
import * as Time from "../lib/Time"
import * as fmt from "../lib/fmt"

const HistogramTooltip = ({segments, ts}) => {
  const total = segments.reduce((sum, [_, count]) => (sum += count), 0)
  const rows = segments
    .sort((a, b) => b[1] - a[1])
    .map(([path, count]) => (
      <tr key="path">
        <td>
          <span className={`tag path-tag ${path}-bg-color`}>{path}</span>
        </td>
        <td className="count">{fmt.withCommas(count)}</td>
      </tr>
    ))
  return (
    <div className="histogram-tooltip">
      <p className="title">{Time.format(ts, "MMM D, YYYY • HH:mm")}</p>
      <table>
        <tbody>
          {rows}
          <tr>
            <td colSpan="2" className="total-row">
              {fmt.withCommas(total)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default HistogramTooltip
