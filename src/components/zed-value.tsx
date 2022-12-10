import React from "react"
import {zed} from "packages/zealot/src"
import {InspectContext} from "src/app/features/inspector/inspect-list"
import {createView} from "src/app/features/inspector/views/create"
import {View} from "src/app/features/inspector/views/view"

/**
 * The ZedValue component renders a single zed value completely
 * with no virtualization
 */

/**
 * you need to identify every value in the grid
 * you need a cell class
 *
 * cell:
 *   key (col,row)
 *   view
 *   field
 *   value
 *
 *   cellValueKey = cell.key + value.key
 *
 *
 *   state
 *     cellKey: {
 *      valueKey: {
 *        isExpanded: true
 *        page: 1
 *      }
 *    }
 *
 *   cell.key, view.key
 *
 *   grid:
 */

/**
 * Data can be stored in the app, on the window, in the tab, or in the location
 */

const grid = {
  cellValues: {
    "0,0-1.3.2": {
      isExpanded: true,
      page: 1,
    },
  },
}

export function ZedValue(props: {
  value: zed.Value
  field?: zed.Field | null
  key?: string | null
}) {
  // Think about this
  const ctx = new InspectContext({
    isExpanded: () => false,
    getValuePage: () => 1,
  })
  const view = createView({
    ctx,
    value: props.value,
    type: props.value.type,
    field: props.field,
    key: props.key,
    last: true,
    indexPath: [0],
  })
  view.inspect()
  return <>{ctx.rows.map((row) => row.render)}</>
}
