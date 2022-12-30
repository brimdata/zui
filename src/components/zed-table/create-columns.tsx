import {zed} from "@brimdata/zealot"
import {ZedTableApi} from "./api"
import {Column} from "./column"

export function createColumns(
  api: ZedTableApi,
  type: zed.Type,
  namePath: string[] = [],
  indexPath: number[] = []
) {
  if (type instanceof zed.TypeRecord) {
    return type.fields.map(
      (field, index) =>
        new Column({
          field,
          api,
          path: [...namePath, field.name],
          indexPath: [...indexPath, index],
        }).def
    )
  } else {
    throw new Error("Unsupported Type" + type.toString())
  }
}
