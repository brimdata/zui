export function cache<T>(self: object, prop: string, func: () => T): T {
  const cache = self[prop]
  if (cache) return cache
  const result = func()
  self[prop] = result
  return result
}
