import React from "react"
import {zed} from "packages/zealot/src"
import {InspectContext} from "src/app/features/inspector/inspect-list"
import {createView} from "src/app/features/inspector/views/create"

/**
 * The ZedValue component renders a single zed value completely
 * with no virtualization
 */

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
  createView({
    ctx,
    value: props.value,
    type: props.value.type,
    field: props.field,
    key: props.key,
    last: true,
    indexPath: [0],
  }).inspect()
  return <>{ctx.rows.map((row) => row.render)}</>
}
