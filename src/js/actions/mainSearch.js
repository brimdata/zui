/* @flow */

import serially from "../lib/serially"
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
import {getSearchProgram} from "../reducers/searchBar"
import {getCurrentSpaceName} from "../reducers/spaces"
import Client from "boom-js-client"
import {errorSearchBarParse} from "./searchBar"
import * as Program from "../lib/Program"
import {setNoticeError} from "./notices"

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

  return fetchAllLogs(state, dispatch, api)
}

const fetchStarred = serially(
  (state, dispatch) => {
    const starredLogs = getStarredLogs(state)
    dispatch(showLogsTab())
    return setTimeout(() => {
      dispatch(mainSearchEvents([...starredLogs]))
      dispatch(completeMainSearch())
    })
  },
  id => clearTimeout(id)
)

const fetchAnalytics = serially(
  (state, dispatch, api) => {
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
      .error(_e => {
        dispatch(completeMainSearch())
        dispatch(setNoticeError("There's a problem talking with the server."))
      })
  },
  handler => handler.abortRequest()
)

const fetchAllLogs = serially(
  (state, dispatch, api) => {
    dispatch(showLogsTab())
    const request = api
      .search({
        space: getCurrentSpaceName(state),
        string: decorateProgram(state),
        timeWindow: timeWindow(state)
      })
      .each(statsReceiver(dispatch))
      .done(() => dispatch(completeMainSearch()))
      .error(_e => {
        dispatch(completeMainSearch())
        dispatch(setNoticeError("There's a problem talking with the server."))
      })
    channels(request, state, dispatch)
    return request
  },
  handler => handler.abortRequest()
)

function decorateProgram(state) {
  if (getInnerTimeWindow(state)) {
    return getSearchProgram(state) + " | " + getHeadProc(state) + "; count()"
  } else {
    return (
      getSearchProgram(state) +
      " | " +
      getHeadProc(state) +
      "; " +
      getCountByTimeProc(state)
    )
  }
}

function timeWindow(state) {
  if (getInnerTimeWindow(state)) {
    return getInnerTimeWindow(state)
  } else {
    return getTimeWindow(state)
  }
}

function channels(request, state, dispatch) {
  if (getInnerTimeWindow(state)) {
    request.channel(1, eventsReceiver(dispatch))
  }
  request
    .channel(1, eventsReceiver(dispatch))
    .channel(0, countByTimeReceiver(dispatch))
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
