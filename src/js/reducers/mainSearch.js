import createReducer from "./createReducer"
import {createSelector} from "reselect"
import {getTimeWindow} from "../reducers/timeWindow"
import {getCurrentSpaceName} from "../reducers/spaces"
import Log from "../models/Log"
import {isTimeWindow} from "../models/TimeWindow"
import countByTimeInterval from "../lib/countByTimeInterval"
import UniqArray from "../models/UniqArray"

const initialState = {
  status: "INIT",
  events: []
}

export default createReducer(initialState, {
  MAIN_SEARCH_CLEAR: () => ({
    ...initialState
  }),
  MAIN_SEARCH_REQUEST: () => ({
    ...initialState,
    status: "FETCHING"
  }),
  MAIN_SEARCH_EVENTS: (state, {events}) => ({
    ...state,
    events: [...state.events, ...events]
  }),
  MAIN_SEARCH_EVENTS_SPLICE: (state, {index}) => {
    const events = [...state.events]
    events.splice(index)
    return {
      ...state,
      events
    }
  },
  MAIN_SEARCH_COMPLETE: state => ({
    ...state,
    status: "COMPLETE"
  })
})

const BOOM_INTERVALS = {
  millisecond: "ms",
  second: "sec",
  minute: "min",
  hour: "hr",
  day: "day"
}

export const getMainSearchIsFetching = state => {
  return getMainSearchStatus(state) === "FETCHING"
}

export const getMainSearchIsComplete = state => {
  return getMainSearchStatus(state) === "COMPLETE"
}

export const getMainSearchStatus = state => {
  return state.mainSearch.status
}

export function mainSearchEvents(state) {
  return state.mainSearch.events
}

export const getMainSearchEvents = state => state.mainSearch.events

export const getSchemas = state => state.descriptors

export const getTds = createSelector(
  getMainSearchEvents,
  tuples => {
    const uniq = new UniqArray()
    tuples.forEach(([td]) => uniq.push(td))
    return uniq.toArray()
  }
)

export const getEventLogs = createSelector(
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

export const getLogs = createSelector(
  getEventLogs,
  logs => logs
)

export const getCountByTimeProc = createSelector(
  getTimeWindow,
  timeWindow => {
    if (isTimeWindow(timeWindow)) {
      const {number, unit} = countByTimeInterval(timeWindow)
      return `every ${number}${BOOM_INTERVALS[unit]} count() by _path`
    }
  }
)
