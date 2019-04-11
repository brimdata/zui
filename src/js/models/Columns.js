/* @flow */

import uniq from "lodash/uniq"
import isEqual from "lodash/isEqual"

export type Column = {
  name: string,
  type: string,
  td: string,
  isVisible: boolean,
  width: number
}

export default class Columns {
  cols: Column[]

  constructor(cols: Column[]) {
    this.cols = cols
  }

  isEqual(other: Columns) {
    return isEqual(this.cols, other.cols)
  }

  getTds(): string[] {
    return uniq(this.cols.map((c) => c.td))
  }

  getAll() {
    return this.cols
  }

  getVisible(): Column[] {
    return this.cols.filter((col) => col.isVisible)
  }

  showHeader() {
    return (
      this.getTds().length === 1 ||
      this.getVisible().length < this.getAll().length
    )
  }

  allVisible() {
    return this.getAll().length === this.getVisible().length
  }
}
