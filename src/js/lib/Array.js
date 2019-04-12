/* @flow */

import isEqual from "lodash/isEqual"
import isNumber from "lodash/isNumber"

export const indexOfLastChange = (
  array: *[],
  accessor: (*) => * = (item) => item
) => {
  if (array.length === 0) return -1
  const lastIndex = array.length - 1
  const lastItem = accessor(array[lastIndex])
  for (let i = lastIndex; i >= 0; i--) {
    if (!isEqual(accessor(array[i]), lastItem)) return i
  }
  return -1
}

export const isEmpty = (array: *[]) => {
  return array.length === 0
}

export const head = (array: *[], n: number) => {
  const newArray = []
  for (let i = 0; i <= n - 1 && i < array.length; ++i) {
    newArray.push(array[i])
  }
  return newArray
}

export const indexInBounds = (index: number, array: *[]) => {
  return isNumber(index) && index >= 0 && index < array.length
}

export const flattenJoin = (array: *[], between: *) => {
  return array
    .filter((a) => !!(a && a.length))
    .reduce((final, item, index, orig) => {
      const next = [...final, ...item]
      if (index !== orig.length - 1) next.push(between)
      return next
    }, [])
}

export const toFront = (array: *[], accessor: (*) => boolean) => {
  const copy = [...array]
  const index = copy.findIndex(accessor)

  if (index > 0) copy.splice(0, 0, copy.splice(index, 1)[0])

  return copy
}

export function first(array: *[]) {
  return array[0]
}

export function same(array: *[]) {
  if (array.length === 0) return true
  if (array.length === 1) return true

  for (let i = 1; i < array.length; ++i) {
    if (!isEqual(array[0], array[i])) return false
  }

  return true
}

export function inBounds(array: *[], index: number) {
  return index >= 0 && index < array.length
}

export function fillWithIndex(desiredLength: number) {
  let arr = []
  for (let i = 0; i < desiredLength; ++i) arr.push(i)
  return arr
}
