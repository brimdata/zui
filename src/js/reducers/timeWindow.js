import createReducer from "./createReducer"
import {extractLastTimeWindow} from "../changeProgramTimeWindow"
import {createSelector} from "reselect"
import {getCurrentSpace} from "./spaces"
import {toDate} from "../cast"
import {isTimeWindow} from "../models/TimeWindow"

const initialState = [null, null]

export default createReducer(initialState, {
  TIME_WINDOW_SET: (state, {timeWindow}) => timeWindow,
  FILTER_NODES_SET: (state, {appliedFilters}) => {
    const {pinnedFilters, currentFilter} = appliedFilters
    const programs = [...pinnedFilters, currentFilter].map(f => f.program)

    for (let program of programs.reverse()) {
      const timeWindow = extractLastTimeWindow(program)
      if (timeWindow) return timeWindow
    }

    return [null, null]
  }
})

export function getUserSelectedTimeWindow(state) {
  return state.timeWindow
}

export const getCurrentSpaceTimeWindow = createSelector(
  getCurrentSpace,
  space => {
    if (!space) return []
    const to = toDate(space.max_time.sec + "." + space.max_time.ns)
    const from = toDate(space.min_time.sec + "." + space.min_time.ns)
    return [from, to]
  }
)

export const getTimeWindow = createSelector(
  getUserSelectedTimeWindow,
  getCurrentSpaceTimeWindow,
  (userTimeWindow, spaceTimeWindow) =>
    isTimeWindow(userTimeWindow) ? userTimeWindow : spaceTimeWindow
)
