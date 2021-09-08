import {TypeAlias, Uint16, Uint32, Uint64, Uint8} from "./index"
import {ZedType} from "./types/types"
import {BString} from "./values/bstring"
import {Duration} from "./values/duration"
import {Float64} from "./values/float64"
import {Int16} from "./values/int16"
import {Int32} from "./values/int32"
import {Int64} from "./values/int64"
import {Int8} from "./values/int8"
import {String} from "./values/string"
import {Time} from "./values/time"
import {ZedInt} from "./values/types"

export function typeId(type: any) {
  switch (type.kind) {
    case "primitive":
    case "alias":
      return type.name
    default:
      if (type.id === undefined) {
        throw new Error("Does not have an id")
      }
      return type.id.toString()
  }
}

export function isAlias(name: string) {
  // an alias is a non-integer string
  return isNaN(name as any)
}

export function isInt(value: unknown): value is ZedInt {
  return (
    value instanceof Int64 ||
    value instanceof Int32 ||
    value instanceof Int16 ||
    value instanceof Int8 ||
    value instanceof Uint64 ||
    value instanceof Uint32 ||
    value instanceof Uint16 ||
    value instanceof Uint8
  )
}

export function isTime(value: unknown): value is Time {
  return value instanceof Time
}

export function isTypeAlias(type: ZedType): type is TypeAlias {
  return type instanceof TypeAlias
}

export function isNamed(type: ZedType, name: string) {
  return isTypeAlias(type) && type.name === name
}

export function trueType<T extends ZedType>(start: ZedType): T {
  let t = start
  while (isTypeAlias(t)) {
    t = t.type
  }
  return t as T
}

export function isNull(value: unknown): value is null {
  return value === null
}

export function isStringy(value: unknown): value is String | BString {
  return value instanceof String || value instanceof BString
}

export function isDuration(value: unknown): value is Duration {
  return value instanceof Duration
}

export function isFloat64(value: unknown): value is Float64 {
  return value instanceof Float64
}
