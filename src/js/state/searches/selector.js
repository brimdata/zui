/* @flow */

import {createSelector} from "reselect"

import type {SearchResults} from "./types"
import type {State} from "../types"

export function getSearches(state: State) {
  return state.searches
}

export function getSearch(state: State, name: string) {
  return state.searches[name]
}

export function getSearchResults(state: State, name: string): SearchResults {
  let search = getSearch(state, name)
  if (search) {
    return search.results
  } else {
    return {descriptors: {}, tuples: {}}
  }
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
    return searches["HistogramSearch"]
  }
)
