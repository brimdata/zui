/* @flow */

import AutoLayout from "./AutoLayout"
import ColumnWidths from "./ColumnWidths"

export default class LayoutFixed extends AutoLayout {
  columnWidths: ColumnWidths

  constructor(opts: $ReadOnly<LayoutFixed>) {
    super(opts)
    this.columnWidths = opts.columnWidths
  }

  columns() {
    return this.columnWidths.columns()
  }

  viewHeight() {
    return this.height - this.rowH
  }

  listWidth() {
    return Math.max(this.columnWidths.total(), this.viewWidth())
  }

  cellWidth(col: string) {
    return this.columnWidths.get(col)
  }
}
