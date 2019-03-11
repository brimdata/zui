/* @flow */

import {
  type BoomSearchStatus as Status,
  getBoomSearches
} from "../reducers/boomSearches"
import {Handler} from "../BoomClient"
import type {Thunk} from "../reducers/types"

export const registerBoomSearch = (name: string, handler: Handler) => ({
  type: "BOOM_SEARCHES_REGISTER",
  search: {
    name,
    handler,
    status: "FETCHING",
    stats: {}
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

export const clearBoomSearches = () => ({
  type: "BOOM_SEARCHES_CLEAR"
})

export const killBoomSearches = (): Thunk => (_dispatch, getState) => {
  const state = getState()
  const searches = getBoomSearches(state)

  for (let name in searches) {
    searches[name].handler.abortRequest()
  }
}
