export const bounded = (num: number, [from, to]: [number, number]) => {
  return Math.max(from, Math.min(num, to))
}
