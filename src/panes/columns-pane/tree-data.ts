import * as zed from "@brimdata/zed-js"
import {ColumnTreeData} from "./types"

export function toTreeData(record: zed.TypeRecord, prevPath: number[] = []) {
  if (!record) return []
  return record.fields.map<ColumnTreeData>((field, index) => {
    const path = [...prevPath, index]
    const id = path.join(",")
    const name = field.name
    const obj: ColumnTreeData = {id, name, field}

    if (field.type instanceof zed.TypeRecord) {
      obj.children = toTreeData(field.type, path)
    }
    return obj
  })
}
