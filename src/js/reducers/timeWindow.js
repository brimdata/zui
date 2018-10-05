/* @flow */

import createReducer from "./createReducer"
import {createSelector} from "reselect"
import {getCurrentSpaceTimeWindow} from "./spaces"
import {isTimeWindow} from "../models/TimeWindow"
import isArray from "lodash/isArray"
import isDate from "lodash/isDate"

const initialState = {
  inner: null,
  outer: null
}

type StateSlice = typeof initialState
type State = {timeWindow: StateSlice}

export default createReducer(initialState, {
  OUTER_TIME_WINDOW_SET: (state, {timeWindow}) => ({
    ...state,
    outer: timeWindow
  }),
  INNER_TIME_WINDOW_SET: (state, {timeWindow}) => ({
    ...state,
    inner: timeWindow
  })
})

export const getRawOuterTimeWindow = (state: State) => state.timeWindow.outer
export const getRawInnerTimeWindow = (state: State) => state.timeWindow.inner
export const getOuterTimeWindow = createSelector(getRawOuterTimeWindow, value =>
  makeDates(value)
)
export const getInnerTimeWindow = createSelector(getRawInnerTimeWindow, value =>
  makeDates(value)
)
export const getTimeWindow = createSelector(
  getOuterTimeWindow,
  getCurrentSpaceTimeWindow,
  (userTimeWindow, spaceTimeWindow) =>
    isTimeWindow(userTimeWindow) ? userTimeWindow : spaceTimeWindow
)

const makeDates = value =>
  isArray(value)
    ? value.map(item => (isDate(item) ? item : new Date(item)))
    : value
