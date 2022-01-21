import {isNull} from "lodash"
import {TypeRecord} from "../types/type-record"
import {trueType} from "./true-type"

export function flatColumns(
  record: TypeRecord,
  columns: (string | string[])[] = [],
  path: string[] | undefined = undefined
) {
  if (isNull(record.fields)) return []
  for (let f of record.fields) {
    const type = trueType(f.type)
    if (type instanceof TypeRecord) {
      flatColumns(type, columns, !path ? [f.name] : [...path, f.name])
    } else {
      columns.push(path ? [...path, f.name] : f.name)
    }
  }
  return columns
}
