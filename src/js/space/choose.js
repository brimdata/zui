/* @flow */

const DEFAULT = "default"

export function chooseSpace(names: string[], current: ?string) {
  if (current && names.includes(current)) return current
  if (names.includes(DEFAULT)) return DEFAULT
  if (names.length > 0) return names[0]
  throw new Error("No Spaces")
}
