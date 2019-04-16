/* @flow */

import {type BoomSearchTag, getBoomSearches} from "../reducers/boomSearches"
import type {Thunk} from "../reducers/types"
import {clearBoomSearches, registerBoomSearch} from "../actions"
import {fetchSearch} from "../../backend/fetch"
import {getCurrentSpaceName} from "../reducers/spaces"
import BaseSearch from "../../models/searches/BaseSearch"

export const killBoomSearches = (tag?: BoomSearchTag): Thunk => (
  _dispatch,
  getState
) => {
  const state = getState()
  const searches = getBoomSearches(state)
  for (let name in searches) {
    if (!tag || searches[name].tag === tag)
      searches[name].handler.abortRequest()
  }
}

export const killBoomSearch = (name: string): Thunk => (_, getState) => {
  const searches = getBoomSearches(getState())
  searches[name] && searches[name].handler.abortRequest()
}

export const cancelBoomSearches = (tag?: BoomSearchTag): Thunk => (
  dispatch,
  getState
) => {
  const state = getState()
  const searches = getBoomSearches(state)
  for (let name in searches) {
    if (!tag || searches[name].tag === tag)
      searches[name].handler.abortRequest(false)
  }
  dispatch(clearBoomSearches(tag))
}

export const cancelBoomSearch = (name: string): Thunk => (
  dispatch,
  getState
) => {
  const searches = getBoomSearches(getState())
  if (searches[name]) {
    searches[name].handler.abortRequest(false)
  }
}

export const issueBoomSearch = (
  search: BaseSearch,
  tag: BoomSearchTag
): Thunk => (dispatch, getState) => {
  const name = search.getName()
  const handler = dispatch(
    fetchSearch(
      search.getProgram(),
      search.getSpan(),
      getCurrentSpaceName(getState())
    )
  )

  dispatch(cancelBoomSearch(name))
  search.receiveData(handler, dispatch)
  search.receiveStats(handler, dispatch)
  dispatch(registerBoomSearch(name, {handler, tag}))
  return handler
}
