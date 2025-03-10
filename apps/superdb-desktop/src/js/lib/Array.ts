import isEqual from "lodash/isEqual"
import isNumber from "lodash/isNumber"
import _uniq from "lodash/uniq"
import _uniqBy from "lodash/uniqBy"
import _sortBy from "lodash/sortBy"

export const uniq = _uniq
export const uniqBy = _uniqBy

export const indexOfLastChange = (
  array: any[],
  accessor: (arg0: any) => any = (item) => item
) => {
  if (array.length === 0) return -1
  const lastIndex = array.length - 1
  const lastItem = accessor(array[lastIndex])
  for (let i = lastIndex; i >= 0; i--) {
    if (!isEqual(accessor(array[i]), lastItem)) return i
  }
  return -1
}

export const isEmpty = (array: any[]) => {
  return array.length === 0
}

export const head = (array: any[], n: number) => {
  const newArray = []
  for (let i = 0; i <= n - 1 && i < array.length; ++i) {
    newArray.push(array[i])
  }
  return newArray
}

export const indexInBounds = (index: number, array: any[]) => {
  return isNumber(index) && index >= 0 && index < array.length
}

export const flattenJoin = (array: any[], between: any) => {
  return array
    .filter((a) => !!(a && a.length))
    .reduce((final, item, index, orig) => {
      const next = [...final, ...item]
      if (index !== orig.length - 1) next.push(between)
      return next
    }, [])
}

export const toFront = (array: any[], accessor: (arg0: any) => boolean) => {
  const copy = [...array]
  const index = copy.findIndex(accessor)

  if (index > 0) copy.splice(0, 0, copy.splice(index, 1)[0])

  return copy
}

export function first(array: any[]) {
  return array[0]
}

export function last(array: any[]) {
  return array[array.length - 1]
}

export function same(array: any[]) {
  if (array.length === 0) return true
  if (array.length === 1) return true

  for (let i = 1; i < array.length; ++i) {
    if (!isEqual(array[0], array[i])) return false
  }

  return true
}

export function inBounds(array: any[], index: number) {
  return index >= 0 && index < array.length
}

export function fillWithIndex(desiredLength: number) {
  const arr = []
  for (let i = 0; i < desiredLength; ++i) arr.push(i)
  return arr
}

export function splice(array: any[], index: number) {
  const copy = [...array]
  copy.splice(index)
  return copy
}

export function concat(array1: any[], array2: any[]) {
  return [...array1, ...array2]
}

export const sortBy = _sortBy

export function swap(array: any[], from: number, to: number) {
  const item1 = array[from]
  const item2 = array[to]
  const copy = [...array]
  copy[to] = item1
  copy[from] = item2
  return copy
}
