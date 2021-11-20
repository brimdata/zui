import {zed} from "zealot"
import * as fmt from "./format"
import {inspectContainer, inspectIndexedContainer} from "./inspect-container"
import {inspectOne} from "./inspect-one"
import {Context} from "./types"

export function inspect(
  ctx: Context,
  value: zed.AnyValue,
  indent = 0,
  field: zed.Field | null = null,
  last = false
) {
  if (value.isUnset() || zed.isPrimitive(value)) {
    const prefix = field ? fmt.key(field) : null
    const suffix = last ? null : ", "
    ctx.push([prefix, inspectOne(ctx, value, field), suffix], indent)
  } else if (value instanceof zed.Record) {
    inspectContainer(ctx, value, indent, field, last, {
      open: "{",
      close: "}",
      iterate: value.fields,
      expanded: {
        field: (d) => d,
        value: (d) => d.value
      },
      collapsed: {
        field: (d) => d,
        value: (d) => d.value
      }
    })
  } else if (value instanceof zed.Array) {
    inspectIndexedContainer(ctx, value, indent, field, last, {
      open: "[",
      close: "]",
      iterate: value.items
    })
  } else if (value instanceof zed.Set) {
    inspectIndexedContainer(ctx, value, indent, field, last, {
      open: "|[",
      close: "]|",
      iterate: value.items
    })
  } else if (value instanceof zed.Union) {
    inspect(ctx, value.value, indent, field, last)
  } else if (value instanceof zed.Map) {
    inspectIndexedContainer(ctx, value, indent, field, last, {
      open: "|{",
      close: "}|",
      iterate: Array.from(value.value.values())
    })
  } else {
    console.log("No Way To Inpsect: " + value.constructor.name)
  }
}
