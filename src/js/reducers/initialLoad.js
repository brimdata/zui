import createReducer from "./createReducer"

const initalState = true

export default createReducer(initalState, {
  MAIN_SEARCH_REQUEST: (_state, _action) => {
    return false
  }
})
