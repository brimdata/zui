import createReducer from "./createReducer"
import pick from "lodash/pick"

const initialState = []

export default createReducer(initialState, {
  SEARCH_HISTORY_PUSH: (state, {entry}) => [...state, entry]
})

export const getSearchHistoryEntry = state =>
  pick(state, "searchBar", "timeWindow")
