/* @flow */

import type {BOOMD_USE_CACHE, BOOMD_USE_INDEX} from "./types"

export default {
  useCache: (value: boolean): BOOMD_USE_CACHE => ({
    type: "BOOMD_USE_CACHE",
    value
  }),
  useIndex: (value: boolean): BOOMD_USE_INDEX => ({
    type: "BOOMD_USE_INDEX",
    value
  })
}
