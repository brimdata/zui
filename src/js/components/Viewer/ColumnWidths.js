/* @flow */

type ColWidthMap = {
  [string]: number,
  default: number
}
export default class ColumnWidths {
  cols: string[]
  colWidths: ColWidthMap

  constructor(cols: string[], colWidths: ColWidthMap) {
    this.cols = cols
    this.colWidths = colWidths
  }

  total() {
    return this.cols.reduce((sum, col) => (sum += this.get(col)), 0)
  }

  get(col: string) {
    if (col in this.colWidths) {
      return this.colWidths[col]
    } else {
      return this.colWidths.default
    }
  }

  columns() {
    return this.cols
  }
}
