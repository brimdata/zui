import {zedTypeClassName} from "app/core/utils/zed-type-class-name"
import React, {MouseEvent} from "react"
import {zed} from "zealot"
import {Union} from "zealot/zed"
import {Context} from "./types"

export function inspectOne(
  ctx: Context,
  value: zed.AnyValue,
  field: zed.Field | null
) {
  const props = {
    key: field?.name + value.toString(),
    className: zedTypeClassName(value),
    onContextMenu: (e: MouseEvent) => ctx.onContextMenu(e, value, field)
  }

  if (value.isUnset()) {
    return <span {...props}>{value.toString()}</span>
  }

  if (value instanceof zed.Record) {
    return <span {...props}>{"{...}"}</span>
  }

  if (value instanceof zed.Array) {
    return <span {...props}>{`Array(${value.items.length})`}</span>
  }

  if (value instanceof zed.Set) {
    return <span {...props}>{`Set(${value.items.length})`}</span>
  }

  if (value instanceof zed.Map) {
    return <span {...props}>{`Map(${value.value.size})`}</span>
  }

  if (zed.isStringy(value)) {
    return <span {...props}>&quot;{value.toString()}&quot;</span>
  }

  if (value instanceof Union) {
    return inspectOne(ctx, value.value, field)
  }

  return <span {...props}>{value.toString()}</span>
}
