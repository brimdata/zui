/* @flow */

import type {ColumnSetting} from "../../types"
import createReducer from "./createReducer"

export type TableColumnSets = {
  [string]: {
    [string]: ColumnSetting
  }
}

const initialState = {}

export default createReducer(initialState, {
  TABLE_LAYOUT_UPDATE: (state, {tableId, updates}) => ({
    ...state,
    [tableId]: Object.keys(updates).reduce(
      (table, colKey) => ({
        ...table,
        [colKey]: {
          ...table[colKey],
          ...updates[colKey]
        }
      }),
      state[tableId] || {}
    )
  })
})
