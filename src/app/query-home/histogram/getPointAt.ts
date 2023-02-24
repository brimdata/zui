import time from "src/js/brim/time"
import {Chart} from "./types"

export const getPointAt = (left: number, chart: Chart) => {
  const ts = chart.xScale.invert(left - chart.margins.left)
  const {number, unit} = chart.data.interval
  for (let index = 0; index < chart.data.points.length; index++) {
    const point = chart.data.points[index]
    const nextTs = time(point.ts).add(number, unit).toDate()
    if (ts >= point.ts && ts < nextTs) return point
  }

  return null
}
