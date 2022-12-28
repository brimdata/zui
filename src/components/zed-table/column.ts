import {zed} from "@brimdata/zealot"
import {createColumnHelper} from "@tanstack/react-table"
import {ZedTableApi} from "./api"
import {createColumns} from "./create-columns"

type Args = {
  api: ZedTableApi
  field: zed.TypeField
  path: number[]
}

const helper = createColumnHelper<zed.Value>()

export class Column {
  constructor(private args: Args) {}

  get id() {
    return `col:${this.args.path.join(",")}`
  }

  get type() {
    return this.args.field.type
  }

  get name() {
    return this.args.field.name
  }

  get path() {
    return this.args.field.path
  }

  get leafDef() {
    return helper.accessor((row: zed.Record) => row.at(this.args.path), {
      id: this.id,
      header: this.name,
      meta: this,
    })
  }

  get groupDef() {
    return helper.group({
      id: this.id,
      header: this.name,
      columns: createColumns(this.args.api, this.type, this.args.path),
      meta: this,
    })
  }

  get isGrouped() {
    const shape = this.args.api.shape
    return this.args.api.handlers.isGrouped(shape, this.id)
  }

  get def() {
    return this.isGrouped ? this.groupDef : this.leafDef
  }

  expand() {
    const shape = this.args.api.shape
    console.log(this.id)
    this.args.api.handlers.setGrouped(shape, this.id, true)
    this.args.api.reset()
  }

  collapse() {
    const shape = this.args.api.shape
    console.log(this.id)
    this.args.api.handlers.setGrouped(shape, this.id, false)
    this.args.api.reset()
  }
}
