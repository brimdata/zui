

export function whatIs(value: any) {
  if (isString(value)) return "String";
  if (isNumber(value)) return "Number";
  if (isArray(value)) return "Array";
  if (isFunction(value)) return "Function";
  if (isObject(value)) return "Object";
  if (isNull(value)) return "Null";
  if (isBoolean(value)) return "Boolean";
  if (isRegExp(value)) return "RegExp";
  if (isError(value)) return "Error";
  if (isDate(value)) return "Date";
  if (isSymbol(value)) return "Symbol";
  if (value === undefined) return undefined;
  if (value.constructor) return value.constructor.name;
  throw `Unknown JS Type: ${JSON.stringify(value)}`;
}

export function isString(value: any) {
  return typeof value === "string";
}

export function isNumber(value: any) {
  return typeof value === "number" && isFinite(value);
}

export function isArray(value: any) {
  return Array.isArray(value);
}

export function isFunction(value: any) {
  return typeof value === "function";
}

export function isObject(value: any) {
  return value && typeof value === "object" && value.constructor === Object;
}

export function isNull(value: any) {
  return value === null;
}

export function isBoolean(value: any) {
  return typeof value === "boolean";
}

export function isRegExp(value: any) {
  return value && typeof value === "object" && value.constructor === RegExp;
}

export function isError(value: any) {
  return value instanceof Error && typeof value.message !== "undefined";
}

export function isDate(value: any) {
  return value instanceof Date;
}

export function isSymbol(value: any) {
  return typeof value === "symbol";
}