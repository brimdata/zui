/* @flow */

import type {TableColumn} from "../../types"
import AutoLayout from "./AutoLayout"

export default class LayoutFixed extends AutoLayout {
  viewHeight() {
    return this.height - this.rowH
  }

  listWidth() {
    const total = this.columns
      .getVisible()
      .reduce((sum, col) => sum + (col.width || 0), 0)
    return Math.max(total, this.viewWidth())
  }

  cellWidth(column: TableColumn) {
    return column.width || 300
  }
}
