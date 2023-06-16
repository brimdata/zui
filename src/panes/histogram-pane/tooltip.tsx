import {CSSProperties} from "react"
import styles from "./histogram-pane.module.css"
import time from "src/js/models/time"
import {withCommas} from "src/js/lib/fmt"
import {WidePoint} from "./types"

export const Tooltip = (props: {
  style: CSSProperties
  data: WidePoint
  colorScale: d3.ScaleOrdinal<string, string>
}) => {
  if (!props.data) return null
  const segments = Object.entries(props.data)
    .filter(
      ([name, count]) =>
        name !== "time" && name !== "sum" && (count as number) > 0
    )
    .map(([name, count]) => ({name, count} as {name: string; count: number}))
    .sort((a, b) => b.count - a.count)

  return (
    <div style={props.style} className={styles.tooltip + " histogram-tooltip"}>
      <p className="ts">
        {time(props.data.time).format("MMM D, YYYY • HH:mm")}
      </p>
      <table>
        <tbody>
          {segments.map(({name, count}) => {
            return (
              <tr key={name}>
                <td>
                  <span
                    className={styles.colorKey}
                    style={{backgroundColor: props.colorScale(name)}}
                  >
                    {name.substring(0, 20)}
                  </span>
                </td>
                <td className="count">{withCommas(count)}</td>
              </tr>
            )
          })}
          <tr>
            <td colSpan={2} className="total-row">
              {withCommas(props.data.sum)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
