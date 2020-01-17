/* @flow */

export type BoomdState = {
  useCache: boolean,
  useIndex: boolean
}

export type BoomdAction = BOOMD_USE_INDEX | BOOMD_USE_CACHE
export type BOOMD_USE_CACHE = {type: "BOOMD_USE_CACHE", value: boolean}
export type BOOMD_USE_INDEX = {type: "BOOMD_USE_INDEX", value: boolean}
