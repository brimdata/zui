export function parseMargin(s: string) {
  const parts = s
    .split(/\s+/)
    .map((s) => s.trim())
    .map(toPixels)
  if (parts.length === 0) throw new Error("Invalid margin")
  if (parts.length === 1) {
    return {left: parts[0], right: parts[0], top: parts[0], bottom: parts[0]}
  }
  if (parts.length === 2) {
    return {top: parts[0], bottom: parts[0], left: parts[1], right: parts[1]}
  }
  if (parts.length === 3) {
    return {top: parts[0], right: parts[1], left: parts[1], bottom: parts[2]}
  }
  if (parts.length === 4) {
    return {top: parts[0], right: parts[1], left: parts[2], bottom: parts[3]}
  }
  throw new Error("Invalid margin")
}

function toPixels(s: string) {
  if (s === "0") return 0
  if (/\d+px/.test(s)) return parseInt(s)

  throw new Error("Only pixel values accepted")
}
