/* @flow */
import {isString} from "../../lib/is"

type ZngType = {name: string, type: ZngType | string}[]

export default function zngToZeekTypes(zng: ZngType): ZngType {
  return zng.map((t) => ({
    name: t.name,
    type: recursiveReplace(t.type)
  }))
}

function recursiveReplace(zng: ZngType | string): ZngType | string {
  if (isString(zng)) return getAlias(zng)
  else return zngToZeekTypes(zng)
}

function getAlias(type: string): string {
  switch (type) {
    case "byte":
    case "int16":
    case "int32":
    case "int64":
    case "uint16":
    case "uint32":
      return "int"
    case "uint64":
      return "count"
    case "float64":
      return "double"
    case "ip":
      return "addr"
    case "net":
      return "subnet"
    case "duration":
      return "interval"
    case "bstring":
      return "string"
    case "zenum":
      return "enum"
    default:
      return type
  }
}
