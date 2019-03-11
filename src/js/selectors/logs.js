/* @flow */

import {createSelector} from "reselect"

import {type State} from "../reducers/types"
import {getCurrentSpaceName} from "../reducers/spaces"
import {getDescriptors} from "../reducers/descriptors"
import {getLogTuples} from "../reducers/logs"
import {getResultsTab} from "../reducers/view"
import Log from "../models/Log"
import * as analysis from "../reducers/analysis"

export const getEventLogs = createSelector<State, void, *, *, *, *>(
  getLogTuples,
  getDescriptors,
  getCurrentSpaceName,
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

export const getTuples = createSelector<State, void, *, *, *, *>(
  getResultsTab,
  getLogTuples,
  analysis.getAnalysis,
  (tab, eventTuples, analysis) => {
    switch (tab) {
      case "logs":
        return eventTuples
      case "analytics":
        return analysis.tuples
      default:
        return eventTuples
    }
  }
)

export const getLogs = createSelector<State, void, *, *, *, *>(
  getResultsTab,
  getEventLogs,
  getAnalysisLogs,
  (tab, eventLogs, analysisLogs) => {
    switch (tab) {
      case "logs":
        return eventLogs
      case "analytics":
        return analysisLogs
      default:
        return eventLogs
    }
  }
)
