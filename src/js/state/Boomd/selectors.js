/* @flow */

import type {State} from "../types"

export default {
  usingCache: (state: State) => state.boomd.useCache,
  usingIndex: (state: State) => state.boomd.useIndex
}
