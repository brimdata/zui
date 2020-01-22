/* @flow */

import type {ColumnsAction, ColumnsState} from "./types"

const init = {}

export default function(state: ColumnsState = init, action: ColumnsAction) {
  switch (action.type) {
    case "COLUMNS_UPDATE":
      var {tableId, updates} = action
      return {
        ...state,
        [tableId]: Object.keys(updates).reduce(
          (table, colKey) => ({
            ...table,
            [colKey]: {
              ...table[colKey],
              ...updates[colKey]
            }
          }),
          state[tableId] || {}
        )
      }
    default:
      return state
  }
}
