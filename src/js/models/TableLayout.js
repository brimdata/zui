/* @flow */

import type {Column, TableColumn, TableSetting} from "../types"
import columnKey from "../lib/columnKey"

export default class TableLayout {
  cols: TableColumn[]
  tableKey: string

  constructor(
    tableKey: string,
    columns: Column[] = [],
    tableSetting: TableSetting = {}
  ) {
    this.tableKey = tableKey
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
}
