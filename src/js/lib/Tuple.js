import uniqBy from "lodash/uniqBy"
import isEqual from "lodash/isEqual"

export const id = ([td, path, ts, uid]) => [td, path, ts, uid].join("_")

export const uniq = list => uniqBy(list, id)

export const removeFrom = (list, tuple) =>
  list.filter(item => !isSame(tuple, item))

export const isSame = (a, b) => isEqual(id(a), id(b))

export const contains = (list, tuple) => list.find(el => isSame(el, tuple))
