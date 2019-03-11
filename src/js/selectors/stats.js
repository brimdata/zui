/* @flow */

import {createSelector} from "reselect"

import type {State} from "../reducers/types"
import {getBoomSearches} from "../reducers/boomSearches"
import {getResultsTab} from "../reducers/view"

export const getSearchStats = createSelector<State, void, *, *, *>(
  getBoomSearches,
  getResultsTab,
  (searches, tab) => {
    if (tab === "logs") {
      return searches["LogSearch"].stats
    }

    if (tab === "analytics") {
      return searches["AnalyticSearch"].stats
    }
  }
)
