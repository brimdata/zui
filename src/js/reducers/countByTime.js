import createReducer from "./createReducer"
import {createSelector} from "reselect"
import countByTimeInterval from "../countByTimeInterval"
import {splitOnEvery} from "../models/TimeWindow"
import {toInt} from "../cast"
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
  (timeWindow, data) => {
    const tuples = data.tuples || []
    const interval = countByTimeInterval(timeWindow)
    const roundedTimeWindow = TimeWindow.floorAndCeil(
      timeWindow,
      interval.roundingUnit
    )
    const buckets = splitOnEvery(roundedTimeWindow, interval)

    let table = new MergeHash()
    let keys = new UniqArray()
    tuples.forEach(d => {
      let ts = toDate(d[0])
      let path = d[1]
      let count = toInt(d[2])
      table.merge(ts, {[path]: count})
      keys.push(path)
    })

    const defaults = keys.toArray().reduce((accum, current) => {
      accum[current] = 0
      return accum
    }, {})

    return {
      data: buckets.map(ts => {
        const subCounts = {...defaults, ...table.get(ts)}
        const count = Object.values(subCounts).reduce(
          (total, count) => total + count,
          0
        )
        return {ts, ...defaults, ...table.get(ts), count}
      }),
      keys: keys.toArray()
    }
  }
)

export function getMainSearchCountByTimeInterval(state) {
  const timeWindow = getTimeWindow(state)
  return countByTimeInterval(timeWindow).unit
}

export function getCountByTimeIsFetching(state) {
  return state.countByTime.isFetching
}
const toDate = string => new Date(string / 1e6)
