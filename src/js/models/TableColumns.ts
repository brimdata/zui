import {FormatConfig} from "app/core/format"
import {estimateCellWidth, estimateHeaderWidth} from "app/viewer/measure"
import {zed} from "zealot"
import columnOrder from "../lib/columnOrder"
import {$Column} from "../state/Columns/models/column"
import {ColumnSettingsMap, TableColumn} from "../state/Columns/types"

export default class TableColumns {
  cols: TableColumn[]
  id: string
  config: Partial<FormatConfig>

  constructor(
    id: string,
    columns: $Column[] = [],
    tableSetting: ColumnSettingsMap = {},
    config: Partial<FormatConfig> = {}
  ) {
    this.id = id
    this.config = config
    this.cols = columnOrder(columns)
      .map(
        ({name, key}, index): TableColumn => ({
          ...{name, position: index},
          ...tableSetting[key]
        })
      )
      .sort((a, b) => (a.position > b.position ? 1 : -1))
  }

  sumWidths() {
    return this.getVisible().reduce(
      (sum, column) => (sum += column.width || 0),
      0
    )
  }

  setWidths(records: zed.Record[]) {
    this.cols.forEach((col) => {
      if (col.width) return
      let max = estimateHeaderWidth(col.name)
      records.forEach((r) => {
        const data = r.try(col.name)
        if (!data) return
        const width = estimateCellWidth(data, col.name, this.config)
        if (width > max) max = width
      })
      col.width = max
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
