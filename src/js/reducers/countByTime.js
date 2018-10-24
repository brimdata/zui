import createReducer from "./createReducer"
import {createSelector} from "reselect"
import countByTimeInterval from "../lib/countByTimeInterval"
import {splitOnEvery} from "../models/TimeWindow"
import * as TimeWindow from "../lib/TimeWindow"
import {getTimeWindow} from "./timeWindow"
import MergeHash from "../models/MergeHash"
import UniqArray from "../models/UniqArray"

const initialState = {
  isFetching: false,
  data: {
    tuples: [],
    descriptor: []
  },
  timeCursor: null,
  error: null
}

export default createReducer(initialState, {
  COUNT_BY_TIME_REQUEST: () => ({
    ...initialState,
    isFetching: true
  }),
  COUNT_BY_TIME_RECEIVE: (state, {data: {descriptor, tuples}}) => ({
    ...state,
    data: {
      descriptor,
      tuples: [...state.data.tuples, ...tuples]
    }
  }),
  COUNT_BY_TIME_ERROR: (state, {error}) => ({
    ...state,
    isFetching: false,
    error
  }),
  COUNT_BY_TIME_SUCCESS: state => ({
    ...state,
    isFetching: false
  }),
  TIME_CURSOR_SET: (state, {date}) => ({
    ...state,
    timeCursor: date.toString()
  })
})

export const getTimeCursor = state => new Date(state.countByTime.timeCursor)
export const getCountByTimeData = state => state.countByTime.data
export const getCountByTimeError = state => state.countByTime.error
export const getMainSearchCountByTime = createSelector(
  getTimeWindow,
  getCountByTimeData,
  (t, d) => formatHistogram(t, d)
)

export const formatHistogram = (timeWindow, data) => {
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
      count: Object.values(table[ts]).reduce((c, sum) => sum + c, 0)
    }
  })

  return {
    data: bins,
    keys: keys.toArray(),
    timeBinCount: buckets.length
  }
}

export function getMainSearchCountByTimeInterval(state) {
  const timeWindow = getTimeWindow(state)
  return countByTimeInterval(timeWindow).unit
}

export function getCountByTimeIsFetching(state) {
  return state.countByTime.isFetching
}
const toDate = string => new Date(string / 1e6)
