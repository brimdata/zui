/* @flow */
import type {Column} from "../reducers/columnGroups"

export default class ColumnGroup {
  name: string
  columns: Column[]

  constructor(name: string, columns: Column[]) {
    this.name = name
    this.columns = columns
  }

  allVisible() {
    return this.columns.every(c => c.isVisible)
  }

  getVisible(): Column[] {
    return this.columns.filter(c => c.isVisible)
  }

  getAll() {
    return this.columns
  }
}
