export default class Layout {
  constructor({width, height, size, rowHeight, columnManager}) {
    this.width = width
    this.height = height
    this.size = size
    this.rowH = rowHeight
    this.columnManager = columnManager
  }

  showHeader() {
    return this.columnManager.showHeader()
  }

  columns(log) {
    return this.columnManager.columns(log)
  }

  viewHeight() {
    if (this.showHeader()) {
      return this.height - this.rowH
    } else {
      return this.height
    }
  }

  viewWidth() {
    return this.width
  }

  listHeight() {
    return this.size * this.rowHeight()
  }

  listWidth() {
    const columnResult = this.columnManager.totalWidth()
    if (typeof columnResult === "string") {
      return columnResult
    } else {
      return Math.max(columnResult, this.viewWidth())
    }
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

  cellWidth(col) {
    return this.columnManager.colWidth(col)
  }
}
