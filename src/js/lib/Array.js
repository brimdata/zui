/* @flow */

import isEqual from "lodash/isEqual"
import isNumber from "lodash/isNumber"

export const indexOfLastChange = (
  array: *[],
  accessor: (*) => * = item => item
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
