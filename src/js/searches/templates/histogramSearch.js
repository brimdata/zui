/* @flow */
import type {Span} from "../../BoomClient/types"
import histogramInterval from "../../lib/histogramInterval"

export function createHistogramSearch(program: string, span: Span) {
  return {
    name: "HistogramSearch",
    tag: "viewer",
    program: mutateProgram(program, span),
    span: span
  }
}

const BOOM_INTERVALS = {
  millisecond: "ms",
  second: "sec",
  minute: "min",
  hour: "hr",
  day: "day",
  month: "month"
}

function mutateProgram(program, span) {
  const {number, unit} = histogramInterval(span)

  return program + ` | every ${number}${BOOM_INTERVALS[unit]} count() by _path`
}
