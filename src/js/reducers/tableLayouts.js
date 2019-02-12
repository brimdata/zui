/* @flow */
import type {ColumnSetting} from "../types"
import createReducer from "./createReducer"

export type TableLayouts = {
  [string]: {
    [string]: ColumnSetting
  }
}

const initialState = {}

export default createReducer(initialState, {
  TABLE_LAYOUT_UPDATE: (state, {tableId, updates}) => {
    const table = getTable(state, tableId)
    return {
      ...state,
      [tableId]: mergeInto(table, updates, colKey => updates[colKey])
    }
  },
  TABLE_LAYOUT_SHOW_ALL: (state, {tableId}) => {
    const table = getTable(state, tableId)

    return {
      ...state,
      [tableId]: mergeInto(table, table, _col => ({isVisible: true}))
    }
  },
  TABLE_LAYOUT_HIDE_ALL: (state, {tableId}) => {
    const table = getTable(state, tableId)

    return {
      ...state,
      [tableId]: mergeInto(table, table, _col => ({isVisible: false}))
    }
  }
})

const mergeInto = (origTable, newTable, eachUpdateFn) => {
  return Object.keys(newTable).reduce(
    (table, colKey) => ({
      ...table,
      [colKey]: {
        ...table[colKey],
        ...eachUpdateFn(colKey)
      }
    }),
    origTable
  )
}

const getTable = (state, id) => {
  return Object.assign(state[id] || {}, {})
}
