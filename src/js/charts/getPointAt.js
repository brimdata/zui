/* @flow */
import type {Chart} from "./types"
import {add} from "../lib/Time"

export const getPointAt = (left: number, chart: Chart) => {
  const ts = chart.xScale.invert(left)
  const {number, unit} = chart.data.interval
  for (let index = 0; index < chart.data.points.length; index++) {
    const point = chart.data.points[index]
    const nextTs = add(point.ts, number, unit)
    if (ts >= point.ts && ts < nextTs) return point
  }

  return null
}
