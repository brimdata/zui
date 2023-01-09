import {zed} from "@brimdata/zealot"
import {createColumnHelper} from "@tanstack/react-table"
import {ZedTableApi} from "./zed-table-api"
import {createColumns} from "./create-columns"

type Args = {
  api: ZedTableApi
  field: zed.TypeField
  path: string[]
  indexPath: number[]
}

const helper = createColumnHelper<zed.Value>()

export class ZedColumn {
  children: null | ZedColumn[]

  constructor(private args: Args) {
    this.children =
      this.isRecordType && this.isGrouped
        ? createColumns(
            this.api,
            this.type,
            this.args.path,
            this.args.indexPath
          )
        : null
  }

  private get api() {
    return this.args.api
  }

  get isRecordType() {
    return this.type instanceof zed.TypeRecord
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

  get typeName() {
    if (zed.isPrimitiveType(this.type)) return this.type.name
    else return this.type.kind
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
      columns: this.children.map((column) => column.def),
      meta: this,
    })
  }

  get isGrouped() {
    return this.api.columnIsExpanded(this.id)
  }

  get def() {
    return Array.isArray(this.children) ? this.groupDef : this.leafDef
  }

  expand() {
    this.api.setColumnExpanded(this.id, true)
  }

  collapse() {
    this.api.setColumnExpanded(this.id, false)
  }

  hide() {
    this.api.setColumnVisible(this.id, false)
  }

  show() {
    this.api.setColumnVisible(this.id, true)
  }
}
