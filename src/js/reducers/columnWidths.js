/* @flow */

import createReducer from "./createReducer"
import type {State} from "./types"

const initialState = {
  default: 75
}

export type ColumnWidths = {
  default: number,
  [string]: number
}

export default createReducer(initialState, {
  COLUMN_WIDTHS_SET: (state, {widths}) => {
    return {
      ...state,
      ...widths
    }
  }
})

export const getAll = (state: State) => {
  return state.columnWidths
}
