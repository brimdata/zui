/* @flow */

import {createSelector} from "reselect"

import {type DateTuple, floorAndCeil} from "../lib/TimeWindow"
import type {Descriptor, Tuple} from "../types"
import type {State} from "./types"
import {getTimeWindow} from "./timeWindow"
import {splitOnEvery} from "../models/TimeWindow"
import MergeHash from "../models/MergeHash"
import UniqArray from "../models/UniqArray"
import histogramInterval, {type Interval} from "../lib/histogramInterval"
import createReducer from "./createReducer"

type Results = {
  tuples: Tuple[],
  descriptor: Descriptor
}

type HistogramChart = {
  data: {ts: Date, [string]: number}[],
  keys: string[],
  timeBinCount: number,
  interval: Interval
}

const initialState = {
  data: {
    tuples: [],
    descriptor: []
  },
  error: null
}

export type Histogram = typeof initialState

export default createReducer(initialState, {
  COUNT_BY_TIME_CLEAR: () => ({
    ...initialState
  }),
  COUNT_BY_TIME_RECEIVE: (state, {data: {descriptor, tuples}}) => ({
    ...state,
    data: {
      descriptor,
      tuples: [...state.data.tuples, ...tuples]
    }
  })
})

export const getHistogramData = (state: State) => state.histogram.data
export const getMainSearchHistogram = createSelector<State, void, *, *, *>(
  getTimeWindow,
  getHistogramData,
  (t, d) => formatHistogram(t, d)
)

export const formatHistogram = (
  timeWindow: DateTuple,
  data: Results
): HistogramChart => {
  const tuples = data.tuples || []
  const interval = histogramInterval(timeWindow)
  const roundedTimeWindow = floorAndCeil(timeWindow, interval.roundingUnit)
  const buckets = splitOnEvery(roundedTimeWindow, interval)
  const keys = new UniqArray()
  const hash = new MergeHash()
  tuples.forEach(d => {
    const ts = toDate(d[0])
    const path = d[1]
    const count = parseInt(d[2])
    keys.push(path)
    hash.merge(ts, {[path]: count})
  })
  const defaults = keys
    .toArray()
    .reduce((obj, path) => ({...obj, [path]: 0}), {})
  const table = hash.toJSON()
  const bins = Object.keys(table).map(ts => {
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

export function getMainSearchHistogramInterval(state: State) {
  const timeWindow = getTimeWindow(state)
  return histogramInterval(timeWindow).unit
}

const toDate = string => new Date(+string * 1000)
