import {zed} from "@brimdata/zealot"
import {ZedTableApi} from "./api"
import {Column} from "./column"

export function createColumns(
  api: ZedTableApi,
  type: zed.Type,
  indexPath: number[] = []
) {
  if (type instanceof zed.TypeRecord) {
    return type.fields.map(
      (field, index) =>
        new Column({field, path: [...indexPath, index], api}).def
    )
  } else {
    throw new Error("Unsupported Type" + type.toString())
  }
}
