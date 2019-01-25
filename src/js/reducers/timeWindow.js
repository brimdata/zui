/* @flow */

import createReducer from "./createReducer"
import {createSelector} from "reselect"
import isArray from "lodash/isArray"
import isDate from "lodash/isDate"
import {last} from "../lib/TimeWindow"
import type {State} from "./types"
import type {DateTuple} from "../lib/TimeWindow"

const initialState = {
  inner: null,
  outer: last(30, "minutes")
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

export const getRawOuterTimeWindow = (state: State) => state.timeWindow.outer
export const getRawInnerTimeWindow = (state: State) => state.timeWindow.inner

export const getOuterTimeWindow = createSelector<State, void, *, *>(
  getRawOuterTimeWindow,
  value => makeDates(value)
)

export const getInnerTimeWindow = createSelector<State, void, *, *>(
  getRawInnerTimeWindow,
  value => makeDates(value)
)
export const getTimeWindow = getOuterTimeWindow

const makeDates = (value): DateTuple =>
  isArray(value)
    ? value.map(item => (isDate(item) ? item : new Date(item)))
    : value
