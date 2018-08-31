import createReducer from "./createReducer"
import {createSelector} from "reselect"
import Query from "../models/Query"
import BroLog from "../models/BroLog"
import {getSearchProgram} from "../reducers/searchBar"
import {getCurrentSpace} from "../reducers/spaces"
import {getTimeWindow} from "../reducers/timeWindow"
import {getCurrentSpaceName} from "../reducers/spaces"
import Log from "../models/Log"
import {isTimeWindow} from "../models/TimeWindow"
import countByTimeInterval from "../countByTimeInterval"

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
  month: "month"
}

export const getMainSearchQuery = createSelector(
  getSearchProgram,
  getCurrentSpace,
  getTimeWindow,
  getProcs,
  (filter, space, timeWindow, procs) =>
    new Query({filter, space, timeWindow, procs})
)

export function getProcs(state) {
  return ["head 1000", getCountByTimeProc(state)]
}

export function getPage(state) {
  return state.mainSearch.page
}

export function mainSearchEvents(state) {
  return state.mainSearch.events
}

export const getMainSearchEvents = state => state.mainSearch.events

export const getSchemas = state => state.broSchemas

export const getMainSearchBroLogs = createSelector(
  getMainSearchEvents,
  getSchemas,
  (events, schemas) => BroLog.buildFrom({events, schemas})
)

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
    return `every ${number}${BOOM_INTERVALS[unit]} count() by _path `
  }
})
