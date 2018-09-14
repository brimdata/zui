import {pushSearchHistory} from "./searchHistory"
import eventsReceiver from "../receivers/eventsReceiver"
import countByTimeReceiver from "../receivers/countByTimeReceiver"
import analyticsReceiver from "../receivers/analyticsReceiver"
import statsReceiver from "../receivers/statsReceiver"
import {showLogsTab, showAnalyticsTab} from "../actions/view"
import {getCountByTimeProc, getHeadProc} from "../reducers/mainSearch"
import {getSearchHistoryEntry} from "../reducers/searchHistory"
import {getStarredLogs} from "../reducers/starredLogs"
import {getInnerTimeWindow, getTimeWindow} from "../reducers/timeWindow"
import {requestCountByTime, successCountByTime} from "./countByTime"
import {getSearchProgram} from "../reducers/searchBar"
import {getCurrentSpaceName} from "../reducers/spaces"
import Ast from "../models/Ast"
import lookytalk from "lookytalk"
import {errorSearchBarParse} from "./searchBar"

export const fetchMainSearch = ({saveToHistory = true} = {}) => (
  dispatch,
  getState,
  api
) => {
  const state = getState()
  let string = getSearchProgram(state)
  const [, error] = parse(string)
  if (error) return dispatch(errorSearchBarParse(error.message))
  dispatch(requestMainSearch({saveToHistory}))
  if (saveToHistory) dispatch(pushSearchHistory(getSearchHistoryEntry(state)))
  if (hasAnalytics(string)) return fetchAnalytics(state, dispatch, api)
  if (string === ":starred") return fetchStarred(state, dispatch, api)
  if (getInnerTimeWindow(state)) return fetchLogSubset(state, dispatch, api)
  return fetchAllLogs(state, dispatch, api)
}

const fetchAnalytics = (state, dispatch, api) => {
  dispatch(showAnalyticsTab())
  return api
    .search({
      space: getCurrentSpaceName(state),
      string: getSearchProgram(state),
      timeWindow: getTimeWindow(state)
    })
    .each(statsReceiver(dispatch))
    .channel(0, analyticsReceiver(dispatch, 0))
    .done(() => dispatch(completeMainSearch()))
}

const fetchStarred = (state, dispatch) => {
  const starredLogs = getStarredLogs(state)
  dispatch(showLogsTab())
  return setTimeout(() => {
    dispatch(mainSearchEvents([...starredLogs]))
    dispatch(completeMainSearch())
  })
}

const fetchLogSubset = (state, dispatch, api) => {
  dispatch(showLogsTab())
  return api
    .search({
      space: getCurrentSpaceName(state),
      string: getSearchProgram(state) + " | " + getHeadProc(state),
      timeWindow: getInnerTimeWindow(state)
    })
    .each(statsReceiver(dispatch))
    .channel(0, eventsReceiver(dispatch))
    .done(() => {
      dispatch(completeMainSearch())
    })
}

const fetchAllLogs = (state, dispatch, api) => {
  const string =
    getSearchProgram(state) +
    " | " +
    getHeadProc(state) +
    "; " +
    getCountByTimeProc(state)

  dispatch(showLogsTab())
  dispatch(requestCountByTime())
  return api
    .search({
      string,
      space: getCurrentSpaceName(state),
      timeWindow: getTimeWindow(state)
    })
    .each(statsReceiver(dispatch))
    .channel(1, eventsReceiver(dispatch))
    .channel(0, countByTimeReceiver(dispatch))
    .done(() => {
      dispatch(completeMainSearch())
      dispatch(successCountByTime())
    })
}

export function requestMainSearch({saveToHistory}) {
  return {
    type: "MAIN_SEARCH_REQUEST",
    saveToHistory
  }
}

export function mainSearchEvents(events = []) {
  return {
    type: "MAIN_SEARCH_EVENTS",
    events
  }
}

export function completeMainSearch() {
  return {
    type: "MAIN_SEARCH_COMPLETE"
  }
}

export function appendMainSearchQueryProgram(fragment) {
  return {
    type: "MAIN_SEARCH_QUERY_PROGRAM_APPEND",
    fragment
  }
}

// This should be it's own module
export const hasAnalytics = string => {
  const ast = new Ast(string).toJSON()
  if (!ast) return false
  if (ast.proc) return true
  else return false
}

const parse = string => {
  let error = null
  let ast = null
  try {
    ast = lookytalk.parse(string)
  } catch (e) {
    error = e
  }
  return [ast, error]
}
