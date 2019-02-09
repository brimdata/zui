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
  COLUMN_SETTING_UPDATE: (state, {tableKey, columnKey, setting}) => {
    const newState = Object.assign(state, {})
    newState[tableKey] = newState[tableKey] || {}
    newState[tableKey][columnKey] = setting
    return newState
  }
})
