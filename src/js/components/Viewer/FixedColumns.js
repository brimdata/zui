export default class FixedColumns {
  constructor(cols, colWidths) {
    this.cols = cols
    this.colWidths = colWidths
  }

  showHeader() {
    return true
  }

  totalWidth() {
    return this.cols.reduce((sum, col) => (sum += this.colWidth(col)), 0)
  }

  colWidth(col) {
    if (col in this.colWidths) {
      return this.colWidths[col]
    } else {
      return this.colWidths.default
    }
  }

  columns(_log) {
    return this.cols
  }
}
