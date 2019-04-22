/* @flow */

import type {COLUMNS_UPDATE, ColumnsState} from "./types"

type Action = COLUMNS_UPDATE

const init = {}

export default function(state: ColumnsState = init, action: Action) {
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
