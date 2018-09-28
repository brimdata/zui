/* @flow */

import {uniqBy} from "lodash"
import isEqual from "lodash/isEqual"

type Tuple = string[]

export const id = ([td, path, ts, uid]: Tuple) => [td, path, ts, uid].join("_")

export const uniq = (list: Tuple[]) => uniqBy(list, id)

export const removeFrom = (list: Tuple[], tuple: Tuple): Tuple[] =>
  list.filter(item => !isSame(tuple, item))

export const isSame = (a: Tuple, b: Tuple) => isEqual(id(a), id(b))

export const contains = (list: Tuple[], tuple: Tuple) =>
  list.find(el => isSame(el, tuple))
