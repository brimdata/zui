/* @flow */

import {getCurrentSpaceTimeWindow} from "../reducers/spaces"
import type {TimeWindow} from "../reducers/timeWindow"
import type {DateTuple} from "../lib/TimeWindow"

export const setOuterTimeWindow = (timeWindow: DateTuple) => ({
  type: "OUTER_TIME_WINDOW_SET",
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

export const init = () => (dispatch: Function, getState: Function) => {
  const timeWindow = getCurrentSpaceTimeWindow(getState())
  dispatch(setOuterTimeWindow(timeWindow))
}
