export function plusOne(string: string) {
  if (string.trim() == "") return ""

  const lastDigit = /(\d+)\s*$/
  const match = lastDigit.exec(string)

  if (!match) {
    return string + " 2"
  } else {
    const digits = match[1]
    const int = parseInt(digits) + 1
    return string.slice(0, match.index) + int.toString()
  }
}
