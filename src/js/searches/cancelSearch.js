/* @flow */

import type {Thunk} from "../state/types"
import {getSearches} from "../state/searches/selector"

export const cancelSearchesByTag = (tag?: string): Thunk => (
  dispatch,
  getState
) => {
  const state = getState()
  const searches = getSearches(state)
  for (let name in searches) {
    if (!tag || searches[name].tag === tag) searches[name].handler.abort(false)
  }
}

export const killSearchesByTag = (tag?: string): Thunk => (
  _dispatch,
  getState
) => {
  const state = getState()
  const searches = getSearches(state)
  for (let name in searches) {
    if (!tag || searches[name].tag === tag) searches[name].handler.abort()
  }
}

export const killSearch = (name: string): Thunk => (_, getState) => {
  const searches = getSearches(getState())
  searches[name] && searches[name].handler.abort()
}
