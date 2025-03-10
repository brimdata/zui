import {createSelector} from "@reduxjs/toolkit"
import Current from "src/js/state/Current"
import Layout from "src/js/state/Layout"

export const whenContext = createSelector(
  Layout.getResultsView,
  Current.getQuery,
  Current.getQueryIsModified,
  (resultsView, query, isModified) => {
    return {
      "results.view": resultsView.toLowerCase(),
      "session.hasQuery": !!query,
      "session.hasModifiedQuery": isModified,
    }
  }
)
