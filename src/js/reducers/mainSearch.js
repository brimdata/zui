import createReducer from "./createReducer"
import {createSelector} from "reselect"
import {getTimeWindow} from "../reducers/timeWindow"
import {getCurrentSpaceName} from "../reducers/spaces"
import Log from "../models/Log"
import {isTimeWindow} from "../models/TimeWindow"
import countByTimeInterval from "../lib/countByTimeInterval"

const initialState = {
  isFetching: false,
  events: []
}

export default createReducer(initialState, {
  MAIN_SEARCH_REQUEST: state => ({...state, isFetching: true, events: []}),
  MAIN_SEARCH_EVENTS: (state, {events}) => ({
    ...state,
    events: [...state.events, ...events]
  }),
  MAIN_SEARCH_COMPLETE: state => ({
    ...state,
    isFetching: false
  })
})

export const getMainSearchIsFetching = state => state.mainSearch.isFetching

const BOOM_INTERVALS = {
  millisecond: "ms",
  second: "sec",
  minute: "min",
  hour: "hr",
  day: "day",
  month: "day"
}

export const getHeadProc = () => "head 1000"
export function getProcs(state) {
  return [getHeadProc(), getCountByTimeProc(state)]
}

export function getPage(state) {
  return state.mainSearch.page
}

export function mainSearchEvents(state) {
  return state.mainSearch.events
}

export const getMainSearchEvents = state => state.mainSearch.events

export const getSchemas = state => state.descriptors

export const getLogs = createSelector(
  getMainSearchEvents,
  getSchemas,
  getCurrentSpaceName,
  (tuples, descriptors, spaceName) => {
    const logs = []
    for (let i = 0; i < tuples.length; ++i) {
      const tuple = tuples[i]
      const descriptor = descriptors[spaceName + "." + tuple[0]]
      if (descriptor) {
        logs.push(new Log(tuple, descriptor))
      }
    }
    return logs
  }
)

export const getCountByTimeProc = createSelector(getTimeWindow, timeWindow => {
  if (isTimeWindow(timeWindow)) {
    const {number, unit} = countByTimeInterval(timeWindow)
    return `every ${number}${BOOM_INTERVALS[unit]} count() by _path`
  }
})
