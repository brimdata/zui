/* @flow */

import type {Width, Layout} from "./Layout"
import Columns from "../../models/Columns"

export default class AutoLayout {
  width: number
  height: number
  size: number
  rowH: number
  columns: Columns

  constructor(args: $ReadOnly<Layout>) {
    this.width = args.width
    this.height = args.height
    this.size = args.size
    this.rowH = args.rowH
    this.columns = args.columns
  }

  isEqual(other: Layout) {
    return (
      this.constructor.name === other.constructor.name &&
      this.width === other.width &&
      this.height === other.height &&
      this.size === other.size &&
      this.rowH === other.rowH &&
      this.columns.isEqual(other.columns)
    )
  }

  allColumns() {
    return this.columns.getAll()
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

  cellWidth(_: string): Width {
    return "auto"
  }
}
