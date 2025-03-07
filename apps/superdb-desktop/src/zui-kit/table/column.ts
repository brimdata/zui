import * as zed from "../../../../../packages/superdb-types/dist"
import {createColumnHelper} from "@tanstack/react-table"
import {createColumns} from "./create-columns"
import {toFieldPath} from "src/js/zed-script/toZedScript"
import {TableViewApi} from "./table-view-api"

type Args = {
  api: TableViewApi
  field: zed.TypeField
  path: string[]
  indexPath: number[]
  parent?: ZedColumn
}

const helper = createColumnHelper<zed.Type>()

export class ZedColumn {
  children: null | ZedColumn[]
  parent: null | ZedColumn

  constructor(private args: Args) {
    this.parent = args.parent
    this.children = this.isRecordType
      ? createColumns(
          this.api,
          this.type,
          this,
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
    return helper.accessor(
      (row: zed.Type) => {
        if (row instanceof zed.Record) return row.fieldAt(this.args.indexPath)
        else {
          return row
        }
      },
      {
        id: this.id,
        header: this.name,
        minSize: 40,
        meta: this,
      }
    )
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

  get isVisible() {
    if (this.parent && !this.parent.isVisible) return false
    return this.api.columnIsVisible(this.id)
  }

  get isExpanded() {
    return this.api.columnIsExpanded(this.id)
  }

  get decendentIds() {
    if (!this.children) return []
    return this.children.flatMap((c) => [c.id, ...c.decendentIds])
  }

  get ancestorIds() {
    if (!this.parent) return []
    return [this.parent.id, ...this.parent.ancestorIds]
  }

  get def() {
    return Array.isArray(this.children) && this.isGrouped
      ? this.groupDef
      : this.leafDef
  }

  get fieldPath() {
    return toFieldPath(this.path)
  }

  get isSortedAsc() {
    return this.api.columnIsSortedAsc(this.fieldPath)
  }

  get isSortedDesc() {
    return this.api.columnIsSortedDesc(this.fieldPath)
  }

  expand() {
    this.api.setColumnExpanded(this.id, true)
  }

  collapse() {
    this.api.setColumnExpanded(this.id, false)
  }

  hide() {
    const ids = [this.id, ...this.decendentIds]
    const obj: Record<string, boolean> = {}
    for (let id of ids) obj[id] = false
    this.api.setColumnVisible(obj)
  }

  show() {
    let ids = [...this.ancestorIds, this.id]
    if (this.isRecordType) ids = ids.concat(this.decendentIds)
    const obj: Record<string, boolean> = {}
    for (let id of ids) obj[id] = true
    this.api.setColumnVisible(obj)
  }
}
