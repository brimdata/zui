import createReducer from "./createReducer"
import {extractLastTimeWindow} from "../changeProgramTimeWindow"
import {createSelector} from "reselect"
import {getCurrentSpaceTimeWindow} from "./spaces"
import {toDate} from "../cast"
import {isTimeWindow} from "../models/TimeWindow"

const initialState = {
  inner: null,
  outer: null
}

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

export const getOuterTimeWindow = state => state.timeWindow.outer
export const getInnerTimeWindow = state => state.timeWindow.inner
export const getTimeWindow = createSelector(
  getOuterTimeWindow,
  getCurrentSpaceTimeWindow,
  (userTimeWindow, spaceTimeWindow) =>
    isTimeWindow(userTimeWindow) ? userTimeWindow : spaceTimeWindow
)
