/* @flow */

import createReducer from "./createReducer"
import type {State} from "./types"

const initialState = []

export type SelectedColumns = {name: string, type: string}[]

export default createReducer(initialState, {
  COLUMNS_SET: (state, {columns}) => {
    return columns
  },
  COLUMNS_TOGGLE: (state, {column}) => {
    const exists = state.find(
      c => c.name === column.name && c.type === column.type
    )
    if (exists) {
      return state.filter(c => c !== exists)
    } else {
      return [column, ...state]
    }
  }
})

export const getSelected = (state: State) => {
  return state.selectedColumns
}
