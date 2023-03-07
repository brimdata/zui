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

export function toZedScript(object: unknown): string {
  if (object instanceof zed.Field) return toFieldPath(object)
  if (object instanceof zed.Primitive) return toZedScriptPrimitive(object)
  if (isString(object)) return toZedScriptString(object)
  if (object instanceof Date) return toZedScriptDate(object)
  if (typeof object === "boolean") return toZedScriptBool(object)
  if (object === null) return toZedScriptNull()
  throw new Error(`Can't convert object to Zed script: ${object}`)
}

const DOUBLE_QUOTE = /"/g
const ESCAPED_DOUBLE_QUOTE = '\\"'
const BACK_SLASH = /\\/g
const ESCAPED_BACK_SLASH = "\\\\"

function toZedScriptNull() {
  return "null"
}

function toZedScriptString(string: string) {
  return `"${string
    .replace(BACK_SLASH, ESCAPED_BACK_SLASH)
    .replace(DOUBLE_QUOTE, ESCAPED_DOUBLE_QUOTE)}"`
}

function toZedScriptDate(date: Date) {
  return date.toISOString()
}

function toZedScriptBool(bool: boolean) {
  return bool ? "true" : "false"
}

function toZedScriptPrimitive(data: zed.Primitive) {
  if (data.isUnset()) {
    return "null"
  } else if (zed.isStringy(data)) {
    return toZedScriptString(data.toString())
  } else {
    return data.toString()
  }
}
