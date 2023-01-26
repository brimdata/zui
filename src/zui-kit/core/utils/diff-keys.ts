export function diffKeys(a: object, b: object) {
  const set = new Set([...Object.keys(a), ...Object.keys(b)])
  for (let key of set) {
    if (a[key] === b[key]) set.delete(key)
  }
  return Array.from(set.values())
}
