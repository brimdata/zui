import {createSelector} from "@reduxjs/toolkit"
import Current from "src/js/state/Current"
import Layout from "src/js/state/Layout"

export const whenContext = createSelector(
  Layout.getResultsView,
  (resultsView) => {
    return {
      "results.view": resultsView.toLowerCase(),
    }
  }
)

export const isSaved = createSelector(
  Current.getSnapshot,
  (snapshot) => snapshot.isSaved
)

export const isModified = createSelector(
  Current.getSnapshot,
  Current.getNextSnapshot,
  (current, next) => current.isSaved && !current.equals(next)
)
