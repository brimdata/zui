/* @flow */

import type {Column, TableColumn, ColumnSettingsMap} from "../types"
import columnKey from "../lib/columnKey"
import columnOrder from "../lib/columnOrder"

export default class TableColumns {
  cols: TableColumn[]
  id: string

  constructor(
    id: string,
    columns: Column[] = [],
    tableSetting: ColumnSettingsMap = {}
  ) {
    this.id = id
    this.cols = columnOrder(columns)
      .map((col, index) => ({
        ...col,
        ...TableColumns.columnDefaults(col, tableSetting, index),
        ...tableSetting[columnKey(col)]
      }))
      .sort((a, b) => (a.position > b.position ? 1 : -1))
  }

  static columnDefaults(
    col: Column,
    settings: ColumnSettingsMap,
    index: number
  ) {
    return {
      width: undefined,
      isVisible: TableColumns.visibilityDefault(settings),
      position: index
    }
  }

  static visibilityDefault(settings: ColumnSettingsMap) {
    const values = Object.values(settings)
    // $FlowFixMe
    return values.every((v) => v.isVisible) || values.every((v) => !v.isVisible)
  }

  sumWidths() {
    return this.getVisible().reduce(
      (sum, column) => (sum += column.width || 0),
      0
    )
  }

  getVisible(): TableColumn[] {
    return this.cols.filter((c) => c.isVisible)
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
    return this.cols.filter((c) => c.isVisible).length
  }

  allVisible() {
    return this.cols.every((c) => c.isVisible)
  }
}
