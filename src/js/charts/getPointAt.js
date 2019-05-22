/* @flow */
import {add} from "../lib/Time"
import Chart from "./Chart"

export const getPointAt = (left: number, chart) => {
  const ts = chart.xScale.invert(left)
  const {number, unit} = chart.data.interval
  for (let index = 0; index < chart.data.points.length; index++) {
    const point = chart.data.points[index]
    const nextTs = add(point.ts, number, unit)
    if (ts >= point.ts && ts < nextTs) return point
  }

  return null
}
