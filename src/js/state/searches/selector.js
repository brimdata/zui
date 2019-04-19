/* @flow */

import type {State} from "../reducers/types"

export function getSearches(state: State) {
  return state.searches
}

export function getSearch(state: State, name: string) {
  return state.searches[name]
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

export function getSearchesByTag(state: State, tag: string) {
  let tagged = []
  let searches = getSearches(state)
  for (let name in searches) {
    let search = searches[name]
    if (search.tag === tag) tagged.push(search)
  }
  return tagged
}
