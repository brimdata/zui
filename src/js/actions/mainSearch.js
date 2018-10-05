/* @flow */

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
import Client from "boom-js-client"
import {errorSearchBarParse} from "./searchBar"
import * as Program from "../lib/Program"

type Options = {
  saveToHistory: boolean
}

export const fetchMainSearch = ({saveToHistory = true}: Options = {}) => (
  dispatch: Function,
  getState: Function,
  api: Client
) => {
  const state = getState()
  let string = getSearchProgram(state)
  const [, error] = Program.parse(string)

  if (error) {
    return dispatch(errorSearchBarParse(error.message))
  }

  dispatch(requestMainSearch({saveToHistory}))

  if (saveToHistory) {
    dispatch(pushSearchHistory(getSearchHistoryEntry(state)))
  }

  if (Program.hasAnalytics(string)) {
    return fetchAnalytics(state, dispatch, api)
  }

  if (string === ":starred") {
    return fetchStarred(state, dispatch)
  }

  if (getInnerTimeWindow(state)) {
    return fetchLogSubset(state, dispatch, api)
  }

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

export function requestMainSearch({saveToHistory}: {saveToHistory: boolean}) {
  return {
    type: "MAIN_SEARCH_REQUEST",
    saveToHistory
  }
}

export function mainSearchEvents(events: [] = []) {
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

export function appendMainSearchQueryProgram(fragment: string) {
  return {
    type: "MAIN_SEARCH_QUERY_PROGRAM_APPEND",
    fragment
  }
}
