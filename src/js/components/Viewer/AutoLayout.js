/* @flow */

import type {TableColumn} from "../../types"
import type {Width, Layout} from "./Layout"
import TableLayout from "../../models/TableLayout"

export default class AutoLayout {
  width: number
  height: number
  size: number
  rowH: number
  columns: TableLayout

  constructor(args: $ReadOnly<Layout>) {
    this.width = args.width
    this.height = args.height
    this.size = args.size
    this.rowH = args.rowH
    this.columns = args.columns
  }

  allColumns() {
    return this.columns.toArray()
  }

  visibleColumns() {
    return this.columns.getVisible()
  }

  viewHeight() {
    return this.height
  }

  viewWidth() {
    return this.width
  }

  listHeight() {
    return this.size * this.rowHeight()
  }

  listWidth(): Width {
    return "auto"
  }

  rowHeight() {
    return this.rowH
  }

  rowWidth() {
    return this.listWidth()
  }

  cellHeight() {
    return this.rowH
  }

  cellWidth(_: TableColumn): Width {
    return "auto"
  }
}
