export function arrayWrap<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) return value
  if (value instanceof NodeList) return Array.from(value) as T[]
  else return [value]
}
