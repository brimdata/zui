import {RecordFieldType, Type} from "zealot/zed/zjson"

export type $Column = {name: string; type: string; key: string}

function getType(type: Type) {
  if (type.kind === "primitive") {
    return type.name
  } else if (type.kind === "typename") {
    return type.name
  } else if (type.kind === "typedef") {
    return type.name
  }
}

export function createColumn(c: RecordFieldType) {
  const type = getType(c.type)
  return {
    name: c.name,
    type,
    key: `${c.name}:${type}`
  }
}
