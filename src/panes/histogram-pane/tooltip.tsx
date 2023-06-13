import {CSSProperties} from "react"
import styles from "./histogram-pane.module.css"
import time from "src/js/models/time"
import {withCommas} from "src/js/lib/fmt"

export const Tooltip = (props: {
  style: CSSProperties
  data: unknown
  colorScale: unknown
}) => {
  if (!props.data) return null
  const entries = Object.entries(props.data)
  return (
    <div style={props.style} className={styles.tooltip + " histogram-tooltip"}>
      <p className="ts">
        {time(props.data.time).format("MMM D, YYYY • HH:mm")}
      </p>
      <table>
        <tbody>
          {entries.map(([name, count]) => {
            if (name === "time" || name === "sum") return null
            return (
              <tr key={name}>
                <td
                  className="tag path-tag"
                  style={{backgroundColor: props.colorScale(name)}}
                >
                  <span>{name.substring(0, 30)}</span>
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
  //   const total = segments.reduce((sum, [_, count]) => (sum += count), 0)
  //   const rows = segments
  //     .sort((a, b) => b[1] - a[1])
  //     .map(([path, count]) => (
  //       <tr key={path}>
  //         <td>
  //           <span
  //             className={`tag path-tag`}
  //             style={{backgroundColor: chart.color(path)}}
  //           >
  //             {path.substring(0, 30)}
  //           </span>
  //         </td>
  //         <td className="count">{fmt.withCommas(count)}</td>
  //       </tr>
  //     ))
  //   return (
  //     <div className="histogram-tooltip">
  //       <p className="ts">{time(ts).format("MMM D, YYYY • HH:mm")}</p>
  //       <table>
  //         <tbody>
  //           {rows}
  //           <tr>
  //             <td colSpan={2} className="total-row">
  //               {fmt.withCommas(total)}
  //             </td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     </div>
  // )_
}
