/* @flow */
import type {DateTuple} from "../../lib/TimeWindow"
import brim from "../../brim"

function convertToSpan(tw: ?DateTuple) {
  if (tw) {
    let [from, to] = tw
    return [brim.time(from).toTs(), brim.time(to).toTs()]
  } else {
    return null
  }
}

export const setOuterTimeWindow = (timeWindow: DateTuple) => ({
  type: "OUTER_TIME_WINDOW_SET",
  timeWindow: convertToSpan(timeWindow)
})

export const setNextOuterTimeWindow = (timeWindow: ?DateTuple) => ({
  type: "NEXT_OUTER_TIME_WINDOW_SET",
  timeWindow: convertToSpan(timeWindow)
})

export const setInnerTimeWindow = (timeWindow: ?DateTuple) => ({
  type: "INNER_TIME_WINDOW_SET",
  timeWindow: convertToSpan(timeWindow)
})

export const setOuterFromTime = (date: Date) => ({
  type: "OUTER_FROM_TIME_SET",
  date: brim.time(date).toTs()
})

export const setOuterToTime = (date: Date) => ({
  type: "OUTER_TO_TIME_SET",
  date: brim.time(date).toTs()
})

export const clearTimeWindows = () => ({
  type: "TIME_WINDOWS_CLEAR"
})

type OldTimeWindow = {
  inner: ?DateTuple,
  outer: DateTuple,
  nextOuter: ?DateTuple
}

export const restoreTimeWindow = (value: OldTimeWindow) => ({
  type: "TIME_WINDOW_RESTORE",
  value: {
    inner: convertToSpan(value.inner),
    outer: convertToSpan(value.outer),
    nextOuter: convertToSpan(value.nextOuter)
  }
})
