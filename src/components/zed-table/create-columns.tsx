import {zed} from "@brimdata/zealot"
import {createColumnHelper} from "@tanstack/react-table"
import {ZedTableApi} from "./api"

const columnHelper = createColumnHelper<zed.Value>()

export function createColumns(
  api: ZedTableApi,
  type: zed.Type,
  indexPath: number[] = []
) {
  if (type instanceof zed.TypeRecord) {
    return createRecordColumns(api, type, indexPath)
  } else {
    console.log(type)
    throw new Error("Unsupported Type")
  }
}

export function createRecordColumns(
  api: ZedTableApi,
  type: zed.TypeRecord,
  indexPath: number[]
) {
  return type.fields.map((field, index) => {
    const path = [...indexPath, index]
    const id = `col:${path.join(",")}`
    if (field.type instanceof zed.TypeRecord && api.isGrouped(id)) {
      return columnHelper.group({
        id,
        header: field.name,
        columns: createRecordColumns(api, field.type, path),
      })
    } else {
      return columnHelper.accessor((row: zed.Record) => row.at(path), {
        id,
        header: field.name,
        meta: field,
      })
    }
  })
}
