import * as actions from "."
import * as selectors from "../selectors"
import * as outMessages from "../boom/outMessages"
import eventsReceiver from "../receivers/eventsReceiver"
import countByTimeReceiver from "../receivers/countByTimeReceiver"
import analyticsReceiver from "../receivers/analyticsReceiver"
import statsReceiver from "../receivers/statsReceiver"

export function fetchMainSearch({saveToHistory = true} = {}) {
  return (dispatch, getState, api) => {
    const query = selectors.getMainSearchQuery(getState())

    if (!query.isValid()) {
      console.warn("invalide query", query.toString())
      return
    }

    if (saveToHistory) {
      dispatch(
        actions.pushSearchHistory(selectors.getSearchHistoryEntry(getState()))
      )
    }

    dispatch(actions.requestMainSearch({saveToHistory}))

    if (query.hasAnalytics()) {
      api
        .send(outMessages.fetchMainSearch(query))
        .each(statsReceiver(dispatch))
        .channel(0, analyticsReceiver(dispatch, 0))
        .done(() => dispatch(actions.completeMainSearch()))
    } else {
      api
        .send(outMessages.fetchMainSearch(query))
        .each(statsReceiver(dispatch))
        .channel(1, eventsReceiver(dispatch))
        .channel(0, countByTimeReceiver(dispatch))
        .done(() => dispatch(actions.completeMainSearch()))
    }
  }
}
