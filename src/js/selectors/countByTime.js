import {createSelector} from "reselect"
import countByTimeInterval from "../countByTimeInterval"
import {splitOnEvery, round} from "../models/TimeWindow"
import {toInt} from "../cast"
import * as selectors from "."
import moment from "moment"
import {getTimeWindow} from "./timeWindow"
import MergeHash from "../models/MergeHash"
import UniqArray from "../models/UniqArray"

export const getCountByTimeData = state => state.countByTime

export const getMainSearchCountByTime = createSelector(
  getTimeWindow,
  getCountByTimeData,
  (timeWindow, data) => {
    const tuples = data.tuples || []
    const interval = countByTimeInterval(timeWindow)
    const roundedTimeWindow = round(timeWindow, interval.roundingUnit)
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
  const timeWindow = selectors.getTimeWindow(state)
  return countByTimeInterval(timeWindow).unit
}

export function getCountByTimeIsFetching(state) {
  return state.countByTime.isFetching
}

function toDate(string) {
  return moment
    .unix(string / 1e9)
    .utc()
    .toDate()
}
