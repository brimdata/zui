/* @flow */

import {type DateTuple, spanOfLast} from "../../lib/TimeWindow"
import type {State} from "./types"
import createReducer from "./createReducer"

const initialState = {
  inner: null,
  outer: spanOfLast(30, "minutes")
}

export type TimeWindow = {
  inner: ?DateTuple,
  outer: DateTuple
}

export default createReducer(initialState, {
  TIME_WINDOWS_CLEAR: () => ({
    ...initialState
  }),
  TIME_WINDOW_RESTORE: (state, {value}) => {
    return {
      ...state,
      ...value
    }
  },
  OUTER_TIME_WINDOW_SET: (state, {timeWindow}) => ({
    ...state,
    outer: timeWindow
  }),
  INNER_TIME_WINDOW_SET: (state, {timeWindow}) => ({
    ...state,
    inner: timeWindow
  }),
  OUTER_FROM_TIME_SET: (state, {date}) => ({
    ...state,
    outer: [date, state.outer[1]]
  }),
  OUTER_TO_TIME_SET: (state, {date}) => ({
    ...state,
    outer: [state.outer[0], date]
  })
})

export const getOuterTimeWindow = (state: State) => state.timeWindow.outer
export const getInnerTimeWindow = (state: State) => state.timeWindow.inner
export const getTimeWindow = getOuterTimeWindow
