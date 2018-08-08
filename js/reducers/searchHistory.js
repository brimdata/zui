import createReducer from "./createReducer"

const initialState = []

export default createReducer(initialState, {
  SEARCH_HISTORY_PUSH: (state, {entry}) => [...state, entry]
})
