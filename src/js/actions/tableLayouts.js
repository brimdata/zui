/* @flow */
import type {Column, ColumnSetting} from "../types"
import TableLayout from "../models/TableLayout"
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

export const showAllColumns = (table: TableLayout) => {
  return updateTableLayout(
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

export const hideAllColumns = (table: TableLayout) => {
  return updateTableLayout(
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
