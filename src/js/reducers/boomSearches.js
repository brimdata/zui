/* @flow */

import {Handler} from "../BoomClient"
import type {State} from "./types"
import createReducer from "./createReducer"

export type BoomSearchStatus = "FETCHING" | "SUCCESS" | "ERROR" | "ABORTED"

export type BoomSearch = {
  name: string,
  status: BoomSearchStatus,
  handler: Handler,
  stats: {}
}

export type BoomSearches = {
  [string]: BoomSearch
}

const initialState = {}

export default createReducer(initialState, {
  BOOM_SEARCHES_REGISTER: (state, {search}) => ({
    ...state,
    [search.name]: search
  }),
  BOOM_SEARCHES_SET_STATUS: (state, {name, status}) => {
    if (!state[name]) throwUpdateError(name)
    return {
      ...state,
      [name]: {...state[name], status}
    }
  },
  BOOM_SEARCHES_SET_STATS: (state, {name, stats}) => {
    if (!state[name]) throwUpdateError(name)
    return {
      ...state,
      [name]: {...state[name], stats}
    }
  },
  BOOM_SEARCHES_CLEAR: () => ({...initialState})
})

const throwUpdateError = name => {
  throw new Error(`Trying to update search that does not exist: ${name}`)
}

export const getBoomSearches = (state: State) => {
  return state.boomSearches
}
