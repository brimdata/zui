import {zed} from "@brimdata/zealot"
import {prevSnippetField} from "@codemirror/autocomplete"
import {createColumnHelper} from "@tanstack/react-table"
import {ZedTableApi} from "./api"
import {createColumns} from "./create-columns"

type Args = {
  api: ZedTableApi
  field: zed.TypeField
  path: string[]
  indexPath: number[]
}

const helper = createColumnHelper<zed.Value>()

export class Column {
  constructor(private args: Args) {}

  private get api() {
    return this.args.api
  }

  get id() {
    return `col:${this.args.indexPath.join(",")}`
  }

  get field() {
    return this.args.field
  }

  get type() {
    return this.field.type
  }

  get name() {
    return this.field.name
  }

  get path() {
    return this.args.path
  }

  get leafDef() {
    return helper.accessor((row: zed.Record) => row.at(this.args.indexPath), {
      id: this.id,
      header: this.name,
      meta: this,
    })
  }

  get groupDef() {
    return helper.group({
      id: this.id,
      header: this.name,
      columns: createColumns(
        this.api,
        this.type,
        this.args.path,
        this.args.indexPath
      ),
      meta: this,
    })
  }

  get isGrouped() {
    const shape = this.api.shape
    return this.api.handlers.isGrouped(shape, this.id)
  }

  get def() {
    return this.isGrouped ? this.groupDef : this.leafDef
  }

  expand() {
    const shape = this.api.shape
    this.api.handlers.setGrouped(shape, this.id, true)
    this.api.reset()
  }

  collapse() {
    const shape = this.api.shape
    this.api.handlers.setGrouped(shape, this.id, false)
    this.api.reset()
  }

  hide() {
    this.api.table.setColumnVisibility((prev) => ({...prev, [this.id]: false}))
    this.api.reset()
  }
}
