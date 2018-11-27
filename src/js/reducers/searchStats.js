import createReducer from "./createReducer"
import {createSelector} from "reselect"
import * as Time from "../lib/Time"

const initialState = {}

export default createReducer(initialState, {
  SEARCH_STATS_SET: (state, {stats}) => stats
})

export const getRawSearchStats = state => state.searchStats
export const getSearchStats = createSelector(getRawSearchStats, stats => stats)
