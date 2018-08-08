import createReducer from "./createReducer"

const initialState = "default"

export default createReducer(initialState, {
  CURRENT_SPACE_NAME_SET: (state, {name}) => name
})
