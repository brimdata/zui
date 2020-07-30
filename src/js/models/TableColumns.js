/* @flow */

import type {$Column} from "../state/Columns/models/column"
import type {ColumnSettingsMap, TableColumn} from "../state/Columns/types"
import Log from "./Log"
import brim from "../brim"
import columnOrder from "../lib/columnOrder"

export default class TableColumns {
  cols: TableColumn[]
  id: string

  constructor(
    id: string,
    columns: $Column[] = [],
    tableSetting: ColumnSettingsMap = {}
  ) {
    this.id = id
    this.cols = columnOrder(columns)
      .map(({name, type, key}, index) => ({
        ...{name, type, position: index},
        ...tableSetting[key]
      }))
      .sort((a, b) => (a.position > b.position ? 1 : -1))
  }

  sumWidths() {
    return this.getVisible().reduce(
      (sum, column) => (sum += column.width || 0),
      0
    )
  }

  setWidths(logs: Log[]) {
    const MAX_WIDTH = 500
    const resizeHandle = 5
    const sortIcon = 11

    this.cols.forEach((col) => {
      if (col.width) return
      let colName = brim.field({value: col.name, name: "", type: ""})
      let max = colName.guessWidth() + resizeHandle + sortIcon

      logs.forEach((log) => {
        let field = log.field(col.name)
        if (field) {
          let len = field.guessWidth()
          if (len > max) max = len
        }
      })

      col.width = Math.min(max, MAX_WIDTH)
    })
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
