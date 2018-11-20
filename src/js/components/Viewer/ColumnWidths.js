export default class ColumnWidths {
  constructor(cols, colWidths) {
    this.cols = cols
    this.colWidths = colWidths
  }

  total() {
    return this.cols.reduce((sum, col) => (sum += this.get(col)), 0)
  }

  get(col) {
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
