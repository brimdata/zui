/* @flow */

import type {Column, TableColumn, ColumnSettingsMap} from "../types"
import columnKey from "../lib/columnKey"

export default class TableColumns {
  cols: TableColumn[]
  id: string

  constructor(
    id: string,
    columns: Column[] = [],
    tableSetting: ColumnSettingsMap = {}
  ) {
    this.id = id
    this.cols = columns
      .map((col, index) => ({
        ...col,
        ...TableColumns.columnDefaults(tableSetting, index),
        ...tableSetting[columnKey(col)]
      }))
      .sort((a, b) => a.position - b.position)
  }

  static columnDefaults(settings: ColumnSettingsMap, index: number) {
    return {
      width: undefined,
      isVisible:
        Object.keys(settings).length === 0 ||
        // $FlowFixMe https://github.com/facebook/flow/issues/2221
        Object.values(settings).every(c => c.isVisible),
      position: index
    }
  }

  sumWidths() {
    return this.getVisible().reduce(
      (sum, column) => (sum += column.width || 0),
      0
    )
  }

  getVisible(): TableColumn[] {
    return this.cols.filter(c => c.isVisible)
  }

  showHeader() {
    return !(this.id === "temp" && this.allVisible())
  }

  toArray() {
    return this.cols
  }

  getColumns() {
    return this.cols
  }

  visibleCount() {
    return this.cols.filter(c => c.isVisible).length
  }

  allVisible() {
    return this.cols.every(c => c.isVisible)
  }
}
