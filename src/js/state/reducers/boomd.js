/* @flow */

import type {State} from "../types"
import createReducer from "./createReducer"

const initialState = {
  useCache: true,
  useIndex: true
}

export type Boomd = typeof initialState

export default createReducer(initialState, {
  BOOMD_CACHE_USE_SET: (state, {value}) => ({
    ...state,
    useCache: value
  }),
  BOOMD_INDEX_USE_SET: (state, {value}) => ({
    ...state,
    useIndex: value
  })
})

export const getUseBoomCache = (state: State) => state.boomd.useCache
export const getUseBoomIndex = (state: State) => state.boomd.useIndex
