/* @flow */

import createReducer from "./createReducer"
import type {State} from "./types"

export const initialState = {
  startTime: 0,
  updateTime: 0,
  bytesMatched: 0,
  bytesRead: 0,
  tuplesMatched: 0,
  tuplesRead: 0
}

export type SearchStats = typeof initialState

export default createReducer(initialState, {
  MAIN_SEARCH_REQUEST: () => ({...initialState}),
  SEARCH_STATS_SET: (state, {stats}) => stats
})

export const getSearchStats = (state: State) => {
  return state.searchStats
}
