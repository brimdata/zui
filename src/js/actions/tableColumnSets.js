/* @flow */
import type {Column, ColumnSetting} from "../types"
import TableColumns from "../models/TableColumns"
import columnKey from "../lib/columnKey"

type Updates = {[string]: ColumnSetting}

export const updateTableColumns = (tableId: string, updates: Updates) => ({
  type: "TABLE_LAYOUT_UPDATE",
  tableId,
  updates
})

export const hideColumn = (tableId: string, column: Column) =>
  updateTableColumns(tableId, {
    [columnKey(column)]: {
      isVisible: false
    }
  })

export const showColumn = (tableId: string, column: Column) =>
  updateTableColumns(tableId, {
    [columnKey(column)]: {
      isVisible: true
    }
  })

export const showAllColumns = (table: TableColumns) => {
  return updateTableColumns(
    table.id,
    table.getColumns().reduce(
      (updates, col) => ({
        ...updates,
        [columnKey(col)]: {isVisible: true}
      }),
      {}
    )
  )
}

export const hideAllColumns = (table: TableColumns) => {
  return updateTableColumns(
    table.id,
    table.getColumns().reduce(
      (updates, col) => ({
        ...updates,
        [columnKey(col)]: {isVisible: false}
      }),
      {}
    )
  )
}
