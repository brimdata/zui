/* @flow */

import {isEqual} from "lodash"

import {type DateTuple, spanOfLast} from "../../lib/TimeWindow"
import type {State} from "../types"
import createReducer from "./createReducer"

const initialState = {
  inner: null,
  outer: spanOfLast(30, "minutes"),
  nextOuter: null
}

export type TimeWindow = {
  inner: ?DateTuple,
  outer: DateTuple,
  nextOuter: ?DateTuple
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
  }),
  NEXT_OUTER_TIME_WINDOW_SET: (state, {timeWindow}) => ({
    ...state,
    nextOuter: isEqual(timeWindow, state.outer) ? null : timeWindow
  }),
  SEARCH_BAR_SUBMIT: ({nextOuter, outer}) => {
    return {
      nextOuter: null,
      outer: nextOuter || outer,
      inner: null
    }
  }
})

export const getOuterTimeWindow = (state: State) => state.timeWindow.outer
export const getNextOuterTimeWindow = (state: State) =>
  state.timeWindow.nextOuter
export const getInnerTimeWindow = (state: State) => state.timeWindow.inner
export const getTimeWindow = getOuterTimeWindow
