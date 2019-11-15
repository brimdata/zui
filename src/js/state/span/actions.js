/* @flow */
import type {DateTuple} from "../../lib/TimeWindow"
import type {TimeWindow} from "../reducers/timeWindow"

export const setOuterTimeWindow = (timeWindow: DateTuple) => ({
  type: "OUTER_TIME_WINDOW_SET",
  timeWindow
})

export const setNextOuterTimeWindow = (timeWindow: ?DateTuple) => ({
  type: "NEXT_OUTER_TIME_WINDOW_SET",
  timeWindow
})

export const setInnerTimeWindow = (timeWindow: ?DateTuple) => ({
  type: "INNER_TIME_WINDOW_SET",
  timeWindow
})

export const setOuterFromTime = (date: Date) => ({
  type: "OUTER_FROM_TIME_SET",
  date
})

export const setOuterToTime = (date: Date) => ({
  type: "OUTER_TO_TIME_SET",
  date
})

export const clearTimeWindows = () => ({
  type: "TIME_WINDOWS_CLEAR"
})

export const restoreTimeWindow = (value: TimeWindow) => ({
  type: "TIME_WINDOW_RESTORE",
  value
})
