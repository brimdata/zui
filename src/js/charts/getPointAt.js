/* @flow */
import {add} from "../lib/Time"
import Chart from "./Chart"

export const getPointAt = (left: number, chart: Chart) => {
  const ts = chart.scales.xScale.invert(left)
  const {number, unit} = chart.data.interval
  for (let index = 0; index < chart.data.data.length; index++) {
    const point = chart.data.data[index]
    const nextTs = add(point.ts, number, unit)
    if (ts >= point.ts && ts < nextTs) return point
  }

  return null
}
