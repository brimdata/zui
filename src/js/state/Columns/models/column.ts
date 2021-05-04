import {zed} from "zealot"
import {RecordFieldType} from "zealot/zjson"

export type $Column = {name: string; type: string; key: string}

export function createColumn(c: RecordFieldType) {
  const type = zed.typeId(c.type)
  return {
    name: c.name,
    type,
    key: `${c.name}:${type}`
  }
}
