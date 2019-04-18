/* @flow */

import type {State} from "../reducers/types"

export function getSearches(state: State) {
  return state.searches
}

export function getSearch(state: State, name: string) {
  return state.searches[name]
}
