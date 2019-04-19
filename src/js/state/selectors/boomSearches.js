/* @flow */

import {createSelector} from "reselect"

import type {State} from "../reducers/types"
import {getBoomSearches} from "../reducers/boomSearches"
import Log from "../../models/Log"
import Stats from "../../models/Stats"

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
