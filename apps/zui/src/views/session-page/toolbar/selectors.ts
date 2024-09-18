import {createSelector} from "@reduxjs/toolkit"
import Layout from "src/js/state/Layout"

export const whenContext = createSelector(
  Layout.getResultsView,
  (resultsView) => {
    return {
      "results.view": resultsView.toLowerCase(),
    }
  }
)
