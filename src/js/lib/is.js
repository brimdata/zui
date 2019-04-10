/* @flow */

export function whatIs(value: *) {
  if (isString(value)) return "String"
  if (isNumber(value)) return "Number"
  if (isArray(value)) return "Array"
  if (isFunction(value)) return "Function"
  if (isObject(value)) return "Object"
  if (isNull(value)) return "Null"
  if (isBoolean(value)) return "Boolean"
  if (isRegExp(value)) return "RegExp"
  if (isError(value)) return "Error"
  if (isDate(value)) return "Date"
  if (isSymbol(value)) return "Symbol"
  throw "Unknown JS Type"
}

export function isString(value: any): %checks {
  return typeof value === "string" || value instanceof String
}

export function isNumber(value: any): %checks {
  return typeof value === "number" && isFinite(value)
}

export function isArray(value: any): %checks {
  return Array.isArray(value)
}

export function isFunction(value: any): %checks {
  return typeof value === "function"
}

export function isObject(value: any): %checks {
  return value && typeof value === "object" && value.constructor === Object
}

export function isNull(value: any): %checks {
  return value === null
}

export function isBoolean(value: any): %checks {
  return typeof value === "boolean"
}

export function isRegExp(value: any): %checks {
  return value && typeof value === "object" && value.constructor === RegExp
}

export function isError(value: any): %checks {
  return value instanceof Error && typeof value.message !== "undefined"
}

export function isDate(value: any): %checks {
  return value instanceof Date
}

export function isSymbol(value: any): %checks {
  return typeof value === "symbol"
}
