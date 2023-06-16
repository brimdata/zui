import {Point, WidePoint} from "./types"
import * as zed from "@brimdata/zed-js"
import * as d3 from "d3"

export function formatData(points: zed.Value[]) {
  const data = points.map(formatDatum) as Point[]
  const keys = getKeys(data)
  const map = groupByTimeAndWiden(data, keys)
  const widePoints = Array.from(map.values())
  const stack = d3.stack().keys(keys)(widePoints)
  return {keys, map, stack, widePoints}
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
  return d3.rollup<Point, number, WidePoint>(
    data,
    (values) => values.reduce(widen, defaults),
    (v) => v.time.getTime()
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
    group: point.get("group").toString(),
    count: point.get("count").toJS(),
  }
}

export function hasTimeField(data: zed.Record[]) {
  return data.every((r) => r.has("time", zed.TypeTime))
}

export function hasGroupField(data: zed.Record[]) {
  return data.every((r) => r.has("group") && !r.get("group").isUnset())
}
