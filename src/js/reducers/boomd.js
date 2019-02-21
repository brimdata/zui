/* @flow */

import createReducer from "./createReducer"
import type {State} from "./types"

const initialState = {
  host: "",
  port: "",
  user: "",
  pass: "",
  useCache: true,
  useIndex: true
}

export type Boomd = typeof initialState

export default createReducer(initialState, {
  BOOMD_CREDENTIALS_SET: (state, {credentials}) => ({
    ...state,
    ...credentials
  }),
  BOOMD_CACHE_USE_SET: (state, {value}) => ({
    ...state,
    useCache: value
  }),
  BOOMD_INDEX_USE_SET: (state, {value}) => ({
    ...state,
    useIndex: value
  })
})

export const getCredentials = (state: State) => {
  const {host, port, user, pass} = state.boomd
  return {host, port, user, pass}
}
export const getBoomHost = (state: State) => state.boomd.host
export const getBoomPort = (state: State) => state.boomd.port
export const getBoomUser = (state: State) => state.boomd.user
export const getUseBoomCache = (state: State) => state.boomd.useCache
export const getUseBoomIndex = (state: State) => state.boomd.useIndex
