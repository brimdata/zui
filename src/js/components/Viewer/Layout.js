const EXCLUDED = ["ts", "_td"]

export default class Layout {
  constructor({width, height, size, rowHeight}) {
    this.width = width
    this.height = height
    this.size = size
    this.rowH = rowHeight
  }

  showHeader() {
    return false
  }

  columns(log) {
    return [
      "ts",
      ...log.descriptor.map(d => d.name).filter(col => !EXCLUDED.includes(col))
    ]
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

  listWidth() {
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

  cellWidth(_) {
    return "auto"
  }
}
