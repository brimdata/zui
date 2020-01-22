/* @flow */
import type {COLUMNS_UPDATE, ColumnUpdates} from "./types"
import type {Column} from "../../types"
import TableColumns from "../../models/TableColumns"
import columnKey from "../../lib/columnKey"

function updateColumns(
  tableId: string,
  updates: ColumnUpdates
): COLUMNS_UPDATE {
  return {
    type: "COLUMNS_UPDATE",
    tableId,
    updates
  }
}

const hideColumn = (tableId: string, column: Column): COLUMNS_UPDATE =>
  updateColumns(tableId, {
    [columnKey(column)]: {
      isVisible: false
    }
  })

const showColumn = (tableId: string, column: Column): COLUMNS_UPDATE =>
  updateColumns(tableId, {
    [columnKey(column)]: {
      isVisible: true
    }
  })

const showAllColumns = (table: TableColumns): COLUMNS_UPDATE => {
  return updateColumns(
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

const hideAllColumns = (table: TableColumns): COLUMNS_UPDATE => {
  return updateColumns(
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

export default {
  updateColumns,
  hideColumn,
  showColumn,
  showAllColumns,
  hideAllColumns
}
