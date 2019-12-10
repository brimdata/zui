/* @flow */
import * as d3 from "d3"

import type {Interval} from "../types"
import type {Span} from "../services/BoomClient/types"

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
