/* @flow */

import type {Span} from "../services/BoomClient/types"
import histogramInterval from "../lib/histogramInterval"

export function addEveryCountProc(program: string, span: Span) {
  const BOOM_INTERVALS = {
    millisecond: "ms",
    second: "sec",
    minute: "min",
    hour: "hr",
    day: "day",
    month: "month"
  }
  const {number, unit} = histogramInterval(span)

  return program + ` | every ${number}${BOOM_INTERVALS[unit]} count() by _path`
}
