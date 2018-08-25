import * as selectors from "../selectors"
import {pushSearchHistory} from "./searchHistory"
import eventsReceiver from "../receivers/eventsReceiver"
import countByTimeReceiver from "../receivers/countByTimeReceiver"
import analyticsReceiver from "../receivers/analyticsReceiver"
import statsReceiver from "../receivers/statsReceiver"
import {showLogsTab, showAnalyticsTab} from "../actions/view"
import {hasAnalytics, isBlank} from "../models/Query"

export function fetchMainSearch({saveToHistory = true} = {}) {
  return (dispatch, getState, api) => {
    const query = selectors.getMainSearchQuery(getState())
    const space = query.space.name
    const timeWindow = query.timeWindow
    const procs = query.procs.join(";")
    let string = isBlank(query.string) ? "*" : query.string

    if (!query.isValid()) {
      console.warn("invalide query", query.toString())
      return
    }

    if (saveToHistory) {
      dispatch(pushSearchHistory(selectors.getSearchHistoryEntry(getState())))
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
      string += " | " + procs
      api
        .search({space, string, timeWindow})
        .each(statsReceiver(dispatch))
        .channel(1, eventsReceiver(dispatch))
        .channel(0, countByTimeReceiver(dispatch))
        .done(() => dispatch(completeMainSearch()))
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
