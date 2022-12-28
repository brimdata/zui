import isString from "lodash/isString"
import {zed} from "@brimdata/zealot"

const needsQuotes = (fieldName: string) => !/^[a-zA-Z_$][\w]*$/.test(fieldName)

export const toFieldPath = (arg: string | string[] | zed.Field) => {
  const result = []
  const path =
    arg instanceof zed.Field ? arg.path : Array.isArray(arg) ? arg : [arg]
  path.forEach((path, i) => {
    if (needsQuotes(path)) {
      // if first path needs quoting, use 'this' as the bracket parent
      if (i === 0) result.push("this")
      result.push(`["${path}"]`)
    } else {
      // prepend path with '.' unless it is the first
      if (i !== 0) result.push(".")
      result.push(path)
    }
  })

  return result.join("")
}

export function toZql(object: unknown): string {
  if (object instanceof zed.Field) return toFieldPath(object)
  if (object instanceof zed.TypeField) return toFieldPath(object.path)
  if (object instanceof zed.Primitive) return toZqlZngPrimitive(object)
  if (isString(object)) return toZqlString(object)
  if (object instanceof Date) return toZqlDate(object)
  if (typeof object === "boolean") return toZqlBool(object)
  if (object === null) return toZqlNull()
  throw new Error(`Can't convert object to ZQL: ${object}`)
}

const DOUBLE_QUOTE = /"/g
const ESCAPED_DOUBLE_QUOTE = '\\"'
const BACK_SLASH = /\\/g
const ESCAPED_BACK_SLASH = "\\\\"

function toZqlNull() {
  return "null"
}

function toZqlString(string: string) {
  return `"${string
    .replace(BACK_SLASH, ESCAPED_BACK_SLASH)
    .replace(DOUBLE_QUOTE, ESCAPED_DOUBLE_QUOTE)}"`
}

function toZqlDate(date: Date) {
  return date.toISOString()
}

function toZqlBool(bool: boolean) {
  return bool ? "true" : "false"
}

function toZqlZngPrimitive(data: zed.Primitive) {
  if (data.isUnset()) {
    return "null"
  } else if (zed.isStringy(data)) {
    return toZqlString(data.toString())
  } else {
    return data.toString()
  }
}
