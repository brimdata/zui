/* @flow */

// DELETE

import type {Thunk} from "../state/types"

export const cancelSearchesByTag = (tag?: string): Thunk => (
  dispatch,
  getState
) => {
  const searches = {}
  for (let name in searches) {
    if (!tag || searches[name].tag === tag) searches[name].handler.abort(false)
  }
}

export const killSearchesByTag = (tag?: string): Thunk => (
  _dispatch,
  getState
) => {
  const searches = {}
  for (let name in searches) {
    if (!tag || searches[name].tag === tag) searches[name].handler.abort()
  }
}

export const killSearch = (name: string): Thunk => (_, getState) => {
  const searches = {}
  searches[name] && searches[name].handler.abort()
}

export function killAllSearches(): Thunk {
  return function(dispatch) {
    return dispatch(killSearchesByTag())
  }
}
