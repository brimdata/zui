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

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && isFinite(value);
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}

export function isObject(value: unknown): value is {} {
  return value && typeof value === "object" && value.constructor === Object;
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isRegExp(value: unknown): value is RegExp {
  return value && typeof value === "object" && value.constructor === RegExp;
}

export function isError(value: unknown): value is Error {
  return value instanceof Error && typeof value.message !== "undefined";
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function isSymbol(value: unknown): value is Symbol {
  return typeof value === "symbol";
}
