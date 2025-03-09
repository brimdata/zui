export function pluralize(string: string, num: number) {
  if (num === 1) return string
  else return string + "s"
}
