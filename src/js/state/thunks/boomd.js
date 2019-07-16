/* @flow */

import type {Thunk} from "../types"
import {useBoomCache, useBoomIndex} from "../actions"

export const enableCache = (value: boolean): Thunk => (
  dispatch,
  getState,
  boom
) => {
  dispatch(useBoomCache(value))
  boom.setOptions({enableCache: value})
}

export const enableIndex = (value: boolean): Thunk => (
  dispatch,
  getState,
  boom
) => {
  dispatch(useBoomIndex(value))
  boom.setOptions({enableCache: value})
}
