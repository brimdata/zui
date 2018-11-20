import createReducer from "./createReducer"

const initialState = {
  default: 75
}

export default createReducer(initialState, {
  COLUMN_WIDTHS_SET: (state, {widths}) => {
    return {
      ...state,
      ...widths
    }
  }
})

export const getAll = state => {
  return state.columnWidths
}
