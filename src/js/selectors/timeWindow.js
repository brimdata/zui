import {createSelector} from "reselect"
import {getCurrentSpace} from "../reducers/spaces"
import {toDate} from "../cast"
import {isTimeWindow} from "../models/TimeWindow"

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
