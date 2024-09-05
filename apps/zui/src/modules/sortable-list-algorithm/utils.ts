export function upTo(length: number) {
  return new Array(length).fill(null).map((item, index) => index)
}

export function move(array: any[], src: number, dst: number) {
  const arr = [...array]
  const item = arr.splice(src, 1)[0]
  arr.splice(dst, 0, item)
  return arr
}

export function clamp(min: number, desired: number, max: number) {
  if (min > desired) return min
  if (max < desired) return max
  return desired
}
