/* @flow */

import {createSelector} from "reselect"

import type {State} from "../state/reducers/types"
import {getBoomSearches} from "../state/reducers/boomSearches"
import {getResultsTab} from "../state/reducers/view"
import Log from "../models/Log"
import Stats from "../models/Stats"

export const getPrimarySearch = createSelector<State, void, *, *, *>(
  getBoomSearches,
  getResultsTab,
  (searches, tab) => {
    if (tab === "logs") return searches["LogSearch"]
    if (tab === "analytics") return searches["AnalyticSearch"]
  }
)

export const getHistogramStatus = createSelector<State, void, *, *>(
  getBoomSearches,
  (searches) => {
    const search = searches["HistogramSearch"]
    return search && search.status
  }
)

export const getSomeAreFetching = createSelector<State, void, *, *>(
  getBoomSearches,
  (searches) => {
    for (let name in searches) {
      if (searches[name].status === "FETCHING") return true
    }
    return false
  }
)

export const getMainSearchIsFetching = createSelector<State, void, *, *>(
  getPrimarySearch,
  (search) => {
    return !!(search && search.status === "FETCHING")
  }
)

export const getDetailStatuses = createSelector<State, void, *, *>(
  getBoomSearches,
  (searches) => {
    const statuses = {}
    for (let name in searches) {
      if (searches[name].tag === "detail")
        statuses[name] = searches[name].status
    }
    return statuses
  }
)

export const getBoomSearchesAsLogs = createSelector<State, void, *, *>(
  getBoomSearches,
  (searches) => {
    const descriptor = [
      {name: "name", type: "string"},
      {name: "status", type: "string"},
      {name: "tag", type: "string"},
      {name: "elapsed", type: "interval"},
      {name: "bytes matched", type: "count"},
      {name: "bytes read", type: "count"},
      {name: "tuples matched", type: "count"},
      {name: "tuples read", type: "count"}
    ]

    let tuples = []

    for (let name in searches) {
      const search = searches[name]
      const stats = new Stats(search.stats)
      tuples.push([
        search.name,
        search.status,
        search.tag,
        stats.getElapsed(),
        stats.getBytesMatched(),
        stats.getBytesRead(),
        stats.getTuplesMatched(),
        stats.getTuplesRead()
      ])
    }

    return Log.build({descriptor, tuples})
  }
)
