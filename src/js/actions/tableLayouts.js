/* @flow */
import type {Column, ColumnSetting} from "../types"
import columnKey from "../lib/columnKey"

type Updates = {[string]: ColumnSetting}

export const updateTableLayout = (tableId: string, updates: Updates) => ({
  type: "TABLE_LAYOUT_UPDATE",
  tableId,
  updates
})

export const hideColumn = (tableId: string, column: Column) =>
  updateTableLayout(tableId, {
    [columnKey(column)]: {
      isVisible: false
    }
  })

export const showColumn = (tableId: string, column: Column) =>
  updateTableLayout(tableId, {
    [columnKey(column)]: {
      isVisible: true
    }
  })

export const showAllColumns = (tableId: string) => ({
  type: "TABLE_LAYOUT_SHOW_ALL",
  tableId
})

export const hideAllColumns = (tableId: string) => ({
  type: "TABLE_LAYOUT_HIDE_ALL",
  tableId
})
