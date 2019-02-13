/* @flow */

import type {Column, TableColumn, TableSetting} from "../types"
import columnKey from "../lib/columnKey"

export default class TableLayout {
  cols: TableColumn[]
  id: string

  constructor(
    id: string,
    columns: Column[] = [],
    tableSetting: TableSetting = {}
  ) {
    this.id = id
    this.cols = columns
      .map((col, index) => ({
        ...col,
        ...TableLayout.columnDefaults(tableSetting, index),
        ...tableSetting[columnKey(col)]
      }))
      .sort((a, b) => a.position - b.position)
  }

  static columnDefaults(settings: TableSetting, index: number) {
    return {
      width: undefined,
      // $FlowFixMe https://github.com/facebook/flow/issues/2221
      isVisible: Object.values(settings).every(c => c.isVisible),
      position: index
    }
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
