import {zed} from "@brimdata/zealot"
import {TableViewApi} from "src/zui-kit/core/table-view/table-view-api"
import {ZedColumn} from "./column"

export function createColumns(
  api: TableViewApi,
  type: zed.Type,
  parent: ZedColumn | null = null,
  namePath: string[] = [],
  indexPath: number[] = []
) {
  if (type instanceof zed.TypeRecord) {
    if (type.fields === null) return []
    return type.fields.map(
      (field, index) =>
        new ZedColumn({
          field,
          api,
          parent,
          path: [...namePath, field.name],
          indexPath: [...indexPath, index],
        })
    )
  } else {
    return [
      new ZedColumn({
        field: new zed.TypeField("this", type),
        api,
        parent: null,
        path: ["this"],
        indexPath: [0],
      }),
    ]
  }
}
