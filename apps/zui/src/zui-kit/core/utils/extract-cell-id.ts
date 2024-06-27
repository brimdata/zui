export function extractCellId(viewId: string) {
  const match = viewId.match(/col:(\d,?)+_row:\d+/)
  if (!match) return null
  if (!match[0]) return null
  return match[0]
}
