/* @flow */
import type {HistogramData} from "../types"
import type {Span} from "../BoomClient/types"
import {floorAndCeil} from "../lib/TimeWindow"
import {splitOnEvery} from "../models/TimeWindow"
import {toDate} from "../lib/TimeField"
import Log from "../models/Log"
import MergeHash from "../models/MergeHash"
import UniqArray from "../models/UniqArray"
import histogramInterval from "../lib/histogramInterval"

export function createHistogramData(
  logs: Log[],
  timeWindow: Span
): HistogramData {
  let interval = histogramInterval(timeWindow)
  let roundedTimeWindow = floorAndCeil(timeWindow, interval.roundingUnit)
  let buckets = splitOnEvery(roundedTimeWindow, interval)
  let keys = new UniqArray()
  let hash = new MergeHash()

  logs.forEach((log) => {
    let ts = toDate(log.get("ts"))
    let path = log.get("_path")
    let count = parseInt(log.get("count"))
    keys.push(path)
    hash.merge(ts, {[path]: count})
  })

  let defaults = keys.toArray().reduce((obj, path) => ({...obj, [path]: 0}), {})
  let table = hash.toJSON()

  let bins = Object.keys(table).map((ts) => {
    return {
      ts: new Date(ts),
      ...defaults,
      ...table[ts],
      count: Object.values(table[ts]).reduce((c, sum) => parseInt(sum) + c, 0)
    }
  })

  return {
    interval,
    data: bins,
    keys: keys.toArray(),
    timeBinCount: buckets.length
  }
}
