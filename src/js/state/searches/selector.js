/* @flow */

import {createSelector} from "reselect"

import type {Search, SearchResults} from "./types"
import type {State} from "../types"
import BoomRequest from "../../services/BoomClient/lib/BoomRequest"

export function getSearches(state: State) {
  return state.searches
}

export function getSearch(state: State, name: string) {
  return state.searches[name] || emptySearch(name)
}

export function getSearchStatus(state: State, name: string) {
  let search = getSearch(state, name)
  if (search) {
    return search.status
  }
}

export function getSearchStats(state: State, name: string) {
  let search = getSearch(state, name)
  if (search) {
    return search.stats
  }
}

export const getLogDetailSearches = createSelector<State, void, *, *>(
  getSearches,
  (searches) => {
    let tagged = []
    for (let name in searches) {
      let search = searches[name]
      if (search.tag === "detail") tagged.push(search)
    }
    return tagged
  }
)

export function getSearchesByTag(state: State, tag: string) {
  let tagged = []
  let searches = getSearches(state)
  for (let name in searches) {
    let search = searches[name]
    if (search.tag === tag) tagged.push(search)
  }
  return tagged
}

export const getHistogramSearch = createSelector<State, void, *, *>(
  getSearches,
  (searches) => {
    return searches["HistogramSearch"] || emptySearch("HistogramSearch")
  }
)

function emptySearch(name): Search {
  return {
    name,
    results: {descriptors: {}, tuples: {}},
    stats: {
      bytesMatched: 0,
      bytesRead: 0,
      tuplesMatched: 0,
      tuplesRead: 0,
      startTime: 0,
      updateTime: 0
    },
    status: "INIT",
    tag: "empty",
    handler: new BoomRequest({url: "", body: "", method: "GET"})
  }
}
