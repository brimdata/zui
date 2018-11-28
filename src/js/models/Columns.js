/* @flow */

import uniq from "lodash/uniq"

type Column = {
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

  getTds() {
    return uniq(this.cols.map(c => c.td))
  }

  getAll() {
    return this.cols
  }

  getVisible(): Column[] {
    return this.cols.filter(col => col.isVisible)
  }
}
