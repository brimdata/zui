/* @flow */
import type {HistogramData, Results} from "../types"
import type {Span} from "../BoomClient/types"
import {floorAndCeil} from "../lib/TimeWindow"
import {splitOnEvery} from "../models/TimeWindow"
import {toDate} from "../lib/TimeField"
import MergeHash from "../models/MergeHash"
import UniqArray from "../models/UniqArray"
import histogramInterval from "../lib/histogramInterval"

export function createHistogramData(
  results: Results,
  timeWindow: Span
): HistogramData {
  let tuples = results.tuples || []
  let interval = histogramInterval(timeWindow)
  let roundedTimeWindow = floorAndCeil(timeWindow, interval.roundingUnit)
  let buckets = splitOnEvery(roundedTimeWindow, interval)
  let keys = new UniqArray()
  let hash = new MergeHash()

  tuples.forEach((d) => {
    let ts = toDate(d[0])
    let path = d[1]
    let count = parseInt(d[2])
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
