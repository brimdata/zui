/* @flow */

import type {State} from "../reducers/types"

export const getColumnSettings = (state: State) => {
  return state.columnSettings
}
