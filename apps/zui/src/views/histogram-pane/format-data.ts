import {Point, WidePoint} from "./types"
import * as zed from "@brimdata/zed-js"
import * as d3 from "d3"

export function formatData(points: zed.Value[]) {
  const data = points.map(formatDatum) as Point[]
  const keys = getKeys(data)
  const map = groupByTimeAndWiden(data, keys)
  const widePoints = Array.from(map.values())

  return {keys, map, widePoints}
}

function getKeys(data: Point[]) {
  return Array.from(new Set(data.map((d) => d.group))).sort()
}

function getDefaultWidePoint(keys: string[]) {
  return keys.reduce<WidePoint>((wide, key: string) => ({...wide, [key]: 0}), {
    time: new Date(),
    sum: 0,
  } as WidePoint)
}

function groupByTimeAndWiden(data: Point[], keys: string[]) {
  const defaults = getDefaultWidePoint(keys)
  return d3.rollup(
    data,
    (values) => values.reduce(widen, defaults),
    (v) => (v.time instanceof Date ? v.time.getTime() : null)
  )
}

function widen(wide: WidePoint, point: Point) {
  const sum = wide.sum + point.count
  const time = point.time
  return {...wide, [point.group]: point.count, sum, time} as WidePoint
}

export function formatDatum(point: zed.Record) {
  return {
    time: point.get("time").toJS(),
    group: formatGroup(point.get("group")),
    count: point.get("count").toJS(),
  }
}

export function formatGroup(value: zed.Value) {
  return value.toString()
}
