/* @flow */

type Column = {name: string, type: string, isVisible: boolean}

export default class Columns {
  cols: Column[]

  constructor(cols: $ReadOnly<Columns>) {
    this.cols = cols
  }

  getAll() {
    return this.cols
  }

  getVisible(): Column[] {
    return this.cols.filter(col => col.isVisible)
  }
}
