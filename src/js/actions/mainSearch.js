import {pushSearchHistory} from "./searchHistory"
import eventsReceiver from "../receivers/eventsReceiver"
import countByTimeReceiver from "../receivers/countByTimeReceiver"
import analyticsReceiver from "../receivers/analyticsReceiver"
import statsReceiver from "../receivers/statsReceiver"
import {showLogsTab, showAnalyticsTab} from "../actions/view"
import {hasAnalytics, isBlank} from "../models/Query"
import {getMainSearchQuery} from "../reducers/mainSearch"
import {getSearchHistoryEntry} from "../reducers/searchHistory"
import {getStarredLogs} from "../reducers/starredLogs"
import {getInnerTimeWindow} from "../reducers/timeWindow"
import {requestCountByTime, successCountByTime} from "./countByTime"

export function fetchMainSearch({saveToHistory = true} = {}) {
  // Please show me show me some love soon
  return (dispatch, getState, api) => {
    const state = getState()
    const query = getMainSearchQuery(getState())
    const space = query.space.name
    const timeWindow = query.timeWindow
    const procs = query.procs.join(";")
    let string = isBlank(query.string) ? "*" : query.string

    const innerTimeWindow = getInnerTimeWindow(state)

    if (string === ":starred") {
      const starredLogs = getStarredLogs(getState())
      dispatch(requestMainSearch({saveToHistory: false}))
      setTimeout(() => {
        dispatch(mainSearchEvents([...starredLogs]))
        dispatch(completeMainSearch())
      })
      return
    }

    if (!query.isValid()) {
      console.warn("invalide query", query.toString())
      return
    }

    if (saveToHistory) {
      dispatch(pushSearchHistory(getSearchHistoryEntry(getState())))
    }

    dispatch(requestMainSearch({saveToHistory}))

    if (hasAnalytics(string)) {
      dispatch(showAnalyticsTab())
      api
        .search({space, string, timeWindow})
        .each(statsReceiver(dispatch))
        .channel(0, analyticsReceiver(dispatch, 0))
        .done(() => dispatch(completeMainSearch()))
    } else {
      dispatch(showLogsTab())

      if (innerTimeWindow) {
        // only logs
        string += " | head 1000"
        api
          .search({space, string, timeWindow: innerTimeWindow})
          .each(statsReceiver(dispatch))
          .channel(0, eventsReceiver(dispatch))
          .done(() => {
            dispatch(completeMainSearch())
          })
      } else {
        dispatch(requestCountByTime())
        string += " | " + procs
        api
          .search({space, string, timeWindow})
          .each(statsReceiver(dispatch))
          .channel(1, eventsReceiver(dispatch))
          .channel(0, countByTimeReceiver(dispatch))
          .done(() => {
            dispatch(completeMainSearch())
            dispatch(successCountByTime())
          })
      }
    }
  }
}

export function requestMainSearch({saveToHistory, query}) {
  return {
    type: "MAIN_SEARCH_REQUEST",
    saveToHistory,
    query
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
