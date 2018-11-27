/* @flow */

type Column = {name: string, type: string}

export default class Columns {
  tds: string[]
  all: Column[]
  visible: Column[]

  constructor(args: $ReadOnly<Columns>) {
    this.tds = args.tds
    this.all = args.all
    this.visible = args.visible
  }

  getTds() {
    return this.tds
  }

  getAll() {
    return this.all
  }

  getVisible(): Column[] {
    return this.visible
  }
}
