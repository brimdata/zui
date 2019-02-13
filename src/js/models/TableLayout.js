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
        ...{width: undefined, isVisible: true, position: index},
        ...tableSetting[columnKey(col)]
      }))
      .sort((a, b) => a.position - b.position)
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
