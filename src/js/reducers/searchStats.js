import createReducer from "./createReducer"

const initialState = {}

export default createReducer(initialState, {
  SEARCH_STATS_SET: (state, {stats}) => stats
})

export const getSearchStats = state => state.searchStats
