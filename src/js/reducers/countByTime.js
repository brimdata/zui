/* @flow */

import createReducer from "./createReducer"
import {createSelector} from "reselect"
import countByTimeInterval from "../lib/countByTimeInterval"
import {splitOnEvery} from "../models/TimeWindow"
import * as TimeWindow from "../lib/TimeWindow"
import {getTimeWindow} from "./timeWindow"
import MergeHash from "../models/MergeHash"
import UniqArray from "../models/UniqArray"
import type {State} from "./types"
import type {DateTuple} from "../lib/TimeWindow"
import type {Interval} from "../lib/countByTimeInterval"

type Results = {
  tuples: [],
  descriptor: []
}

type Histogram = {
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

export type CountByTime = typeof initialState

export default createReducer(initialState, {
  COUNT_BY_TIME_RESET: () => ({
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

export const getCountByTimeData = (state: State) => state.countByTime.data
export const getMainSearchCountByTime = createSelector(
  getTimeWindow,
  getCountByTimeData,
  (t, d) => formatHistogram(t, d)
)

export const formatHistogram = (
  timeWindow: DateTuple,
  data: Results
): Histogram => {
  const tuples = data.tuples || []
  const interval = countByTimeInterval(timeWindow)
  const roundedTimeWindow = TimeWindow.floorAndCeil(
    timeWindow,
    interval.roundingUnit
  )
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

export function getMainSearchCountByTimeInterval(state: State) {
  const timeWindow = getTimeWindow(state)
  return countByTimeInterval(timeWindow).unit
}

const toDate = string => new Date(+string * 1000)
