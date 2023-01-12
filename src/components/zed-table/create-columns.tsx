import {zed} from "@brimdata/zealot"
import {ZedTableApi} from "./zed-table-api"
import {ZedColumn} from "./column"

export function createColumns(
  api: ZedTableApi,
  type: zed.Type,
  parent: ZedColumn | null = null,
  namePath: string[] = [],
  indexPath: number[] = []
) {
  if (type instanceof zed.TypeRecord) {
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
