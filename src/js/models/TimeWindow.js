/*
  A time window is an array with two dates in it.
  [new Date(), new Date()]
*/
import * as d3 from "d3"
import * as Time from "../lib/Time"
import isArray from "lodash/isArray"
import isDate from "lodash/isDate"

export function isTimeWindow(timeWindow) {
  return (
    isArray(timeWindow) &&
    timeWindow.length === 2 &&
    isDate(timeWindow[0]) &&
    isDate(timeWindow[1])
  )
}

export function splitOnEvery(timeWindow, {number, unit}) {
  switch (unit) {
    case "second":
      return d3.utcSecond.range(...timeWindow, number)
    case "minute":
      return d3.utcMinute.range(...timeWindow, number)
    case "hour":
      return d3.utcHour.range(...timeWindow, number)
    case "day":
      return d3.utcDay.range(...timeWindow, number)
    case "month":
      return d3.utcMonth.range(...timeWindow, number)
  }
}

export function round([start, end], unit) {
  return [
    Time.parse(start)
      .startOf(unit)
      .toDate(),
    Time.parse(end)
      .endOf(unit)
      .toDate()
  ]
}
