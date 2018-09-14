import createReducer from "./createReducer"
import {createSelector} from "reselect"
import * as Time from "../lib/Time"

const initialState = {}

export default createReducer(initialState, {
  SEARCH_STATS_SET: (state, {stats}) => normalize(stats)
})

const normalize = stats => ({
  ...stats,
  updateTime: Time.toStore(stats.updateTime),
  startTime: Time.toStore(stats.startTime)
})

const parse = stats => ({
  ...stats,
  updateTime: Time.fromStore(stats.updateTime),
  startTime: Time.fromStore(stats.startTime)
})

export const getRawSearchStats = state => state.searchStats
export const getSearchStats = createSelector(getRawSearchStats, stats =>
  parse(stats)
)
