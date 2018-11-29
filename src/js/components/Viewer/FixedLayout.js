/* @flow */

import AutoLayout from "./AutoLayout"

export default class LayoutFixed extends AutoLayout {
  viewHeight() {
    return this.height - this.rowH
  }

  listWidth() {
    const total = this.columns
      .getVisible()
      .reduce((sum, col) => sum + col.width, 0)

    return Math.max(total, this.viewWidth())
  }

  cellWidth(columnName: string) {
    // FIX
    const col = this.columns.cols.find(({name}) => name === columnName)
    if (col) return col.width
    else return "auto"
  }
}
