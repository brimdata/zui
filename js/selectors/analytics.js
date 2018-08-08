import {getTimeWindow} from "./timeWindow"
import {createSelector} from "reselect"
import {isTimeWindow} from "../models/TimeWindow"
import countByTimeInterval from "../countByTimeInterval"

const BOOM_INTERVALS = {
  millisecond: "ms",
  second: "sec",
  minute: "min",
  hour: "hr",
  day: "day",
  month: "month"
}

export const getCountByTimeProc = createSelector(getTimeWindow, timeWindow => {
  if (isTimeWindow(timeWindow)) {
    const {number, unit} = countByTimeInterval(timeWindow)
    return `every ${number}${BOOM_INTERVALS[unit]} count() by _path `
  }
})
