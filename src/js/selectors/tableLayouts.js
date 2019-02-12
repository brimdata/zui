/* @flow */

import type {State} from "../reducers/types"

export const getTableLayouts = (state: State) => {
  return state.tableLayouts
}
