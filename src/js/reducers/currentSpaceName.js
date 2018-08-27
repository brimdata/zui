import createReducer from "./createReducer"

const initialState = null

export default createReducer(initialState, {
  CURRENT_SPACE_NAME_SET: (state, {name}) => name,
  SPACE_UNSELECT: () => null
})
