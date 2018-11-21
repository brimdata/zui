/* @flow */

import Layout from "./Layout"
import ColumnWidths from "./ColumnWidths"

export default class FixedLayout extends Layout {
  columnWidths: ColumnWidths

  constructor(props: *) {
    super(props)
    this.columnWidths = props.columnManager
  }

  showHeader() {
    return true
  }

  columns(_: *) {
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
