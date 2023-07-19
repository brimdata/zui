export function parsePoint(point: string): [string, string] {
  const words = point.split(/\s+/).map((s) => s.trim())
  if (words.length === 0) throw new Error("No words passed to point")
  if (words.length === 1) throw new Error("Must pass two words to point")
  if (words.length > 2) throw new Error("Too many words passed to point")

  return words.sort((a, b) => {
    if (a === "left" || a === "right") return -1
    if (a === "top" || a === "bottom") return 1
    if (b === "top" || b === "bottom") return -1
    if (b === "left" || b === "right") return 1
    return 0
  }) as [string, string]
}
