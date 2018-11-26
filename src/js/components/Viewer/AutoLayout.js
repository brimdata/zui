/* @flow */

import Log from "../../models/Log"
import type {Width, Layout} from "./Layout"

const EXCLUDED = ["ts", "_td"]
export default class AutoLayout implements Layout {
  width: number
  height: number
  size: number
  rowH: number

  constructor(opts: $ReadOnly<Layout>) {
    this.width = opts.width
    this.height = opts.height
    this.size = opts.size
    this.rowH = opts.rowH
  }

  columns(log: Log) {
    const cols = log.descriptor
      .map(d => d.name)
      .filter(col => !EXCLUDED.includes(col))
    return ["ts", ...cols]
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

  cellWidth(_: string): Width {
    return "auto"
  }
}
