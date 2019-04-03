/* @flow */
/*
  A time window is an array with two dates in it.
  [new Date(), new Date()]

  Delete this file in favor of lib/TimeWindow
*/
import * as d3 from "d3"

import type {Interval} from "../lib/histogramInterval"
import type {Span} from "../BoomClient/types"

export function splitOnEvery(timeWindow: Span, {number, unit}: Interval) {
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
    default:
      throw new Error("Unknown Unit")
  }
}
