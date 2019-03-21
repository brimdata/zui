/* @flow */

import {
  type BoomSearchTag,
  type BoomSearchStatus as Status,
  getBoomSearches
} from "../reducers/boomSearches"
import {Handler} from "../BoomClient"
import type {Thunk} from "../reducers/types"
import {getCurrentSpaceName} from "../reducers/spaces"
import BaseSearch from "../models/searches/BaseSearch"

type RegisterOpts = {handler: Handler, tag: BoomSearchTag}

export const registerBoomSearch = (name: string, opts: RegisterOpts) => ({
  type: "BOOM_SEARCHES_REGISTER",
  search: {
    name,
    handler: opts.handler,
    status: "FETCHING",
    stats: {},
    tag: opts.tag
  }
})

export const setBoomSearchStatus = (name: string, status: Status) => ({
  type: "BOOM_SEARCHES_SET_STATUS",
  name,
  status
})

export const setBoomSearchStats = (name: string, stats: {}) => ({
  type: "BOOM_SEARCHES_SET_STATS",
  name,
  stats
})

export const clearBoomSearches = (tag?: string) => ({
  type: "BOOM_SEARCHES_CLEAR",
  tag
})

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

export const issueBoomSearch = (
  search: BaseSearch,
  tag: BoomSearchTag
): Thunk => (dispatch, getState, boom) => {
  const program = search.getProgram()
  const searchSpan = search.getSpan()
  const searchSpace = getCurrentSpaceName(getState())
  const name = search.getName()
  const handler = boom.search(program, {searchSpan, searchSpace})

  search.receiveData(handler, dispatch)
  search.receiveStats(handler, dispatch)

  dispatch(registerBoomSearch(name, {handler, tag}))
  return handler
}
