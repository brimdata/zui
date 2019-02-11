/* @flow */
import type {ColumnSetting} from "../types"
import createReducer from "./createReducer"

export type TableSettings = {
  [string]: {
    [string]: ColumnSetting
  }
}

const initialState = {}

export default createReducer(initialState, {
  TABLE_SETTINGS_UPDATE: (state, {tableKey, updates}) => {
    const table = Object.assign(state[tableKey] || {}, {})
    for (const column in updates) {
      table[column] = {
        ...table[column],
        ...updates[column]
      }
    }
    const newState = {
      ...state,
      [tableKey]: table
    }
    return newState
  }
})
