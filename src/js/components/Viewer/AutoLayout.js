/* @flow */

import type {Width, Layout} from "./Layout"

export default class AutoLayout {
  type: "auto" | "fixed"
  width: number
  height: number
  size: number
  rowH: number
  rowW: number | "auto"

  constructor(args: $ReadOnly<Layout>) {
    this.width = args.width
    this.height = args.height
    this.size = args.size
    this.rowH = args.rowH
    this.rowW = args.rowW
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
    return this.rowW
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
}
