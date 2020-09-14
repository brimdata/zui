import {uniqBy} from "lodash"
import isEqual from "lodash/isEqual"

import {Tuple} from "../types"

export const id = ([td, path, ts, uid]: Tuple) => {
  return [td, path, ts, uid].join("_")
}

export const uniq = (list: Tuple[]): Tuple[] => {
  return uniqBy(list, id)
}

export const removeFrom = (list: Tuple[], tuple: Tuple): Tuple[] => {
  return list.filter((item) => !isSame(tuple, item))
}

export const isSame = (a: Tuple, b: Tuple) => {
  return isEqual(id(a), id(b))
}

export const contains = (list: Tuple[], tuple: Tuple) => {
  return list.find((el) => isSame(el, tuple))
}
