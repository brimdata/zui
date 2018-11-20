import Layout from "./Layout"

export default class FixedLayout extends Layout {
  constructor(props) {
    super(props)
    this.columnWidths = props.columnManager
  }

  showHeader() {
    return true
  }

  columns(_) {
    return this.columnWidths.columns()
  }

  viewHeight() {
    return this.height - this.rowH
  }

  listWidth() {
    return Math.max(this.columnWidths.total(), this.viewWidth())
  }

  cellWidth(col) {
    return this.columnWidths.get(col)
  }
}
