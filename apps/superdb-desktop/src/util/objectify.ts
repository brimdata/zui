export function objectify(keys, value) {
  let obj = {}
  for (let key of keys) obj[key] = value
  return obj
}
