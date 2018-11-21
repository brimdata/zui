/* @flow */

import Log from "../../models/Log"

const EXCLUDED = ["ts", "_td"]

type Opts = {width: number, height: number, size: number, rowHeight: number}

export default class Layout {
  width: number
  height: number
  size: number
  rowH: number

  constructor(opts: Opts) {
    this.width = opts.width
    this.height = opts.height
    this.size = opts.size
    this.rowH = opts.rowHeight
  }

  showHeader() {
    return false
  }

  columns(log: Log) {
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

  cellWidth(_: string) {
    return "auto"
  }
}
