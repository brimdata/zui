/* @flow */

import type {Column} from "../types"
import type {ColumnSettingsMap, TableColumn} from "../state/columns/types"
import Log from "./Log"
import brim from "../brim"
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

  setWidths(logs: Log[]) {
    const MAX_WIDTH = 500
    const resizeHandle = 5
    const sortIcon = 11

    this.cols.forEach((col) => {
      if (col.width) return
      let colName = brim.field({value: "", type: "", name: col.name})
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
