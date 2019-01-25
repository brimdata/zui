/* @flow */

import {createSelector} from "reselect"
import Log from "../models/Log"
import * as mainSearch from "../reducers/mainSearch"
import * as spaces from "../reducers/spaces"
import * as view from "../reducers/view"
import * as analysis from "../reducers/analysis"
import {type State} from "../reducers/types"

export const getEventLogs = createSelector<State, void, *, *, *, *>(
  mainSearch.getMainSearchEvents,
  mainSearch.getSchemas,
  spaces.getCurrentSpaceName,
  (tuples, descriptors, spaceName) => {
    const logs = []
    for (let i = 0; i < tuples.length; ++i) {
      const tuple = tuples[i]
      const descriptor = descriptors[spaceName + "." + tuple[0]]
      if (descriptor) {
        logs.push(new Log(tuple, descriptor))
      }
    }
    return logs
  }
)

export const getAnalysisLogs = createSelector<State, void, *, *>(
  analysis.getAnalysis,
  data => {
    const {descriptor, tuples} = data
    return tuples.map(t => new Log(t, descriptor))
  }
)

export const getLogs = createSelector<State, void, *, *, *, *>(
  view.getResultsTab,
  getEventLogs,
  getAnalysisLogs,
  (tab, eventLogs, analysisLogs) => {
    switch (tab) {
      case "logs":
        return eventLogs
      case "analytics":
        return analysisLogs
      default:
        return []
    }
  }
)
