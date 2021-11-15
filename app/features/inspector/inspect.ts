import {ReactNode} from "react-markdown"
import {zed} from "zealot"
import * as fmt from "./format"
import {Context} from "./types"

export function inspect(
  ctx: Context,
  value: zed.AnyValue,
  indent = 0,
  name: string | null = null,
  last = false
) {
  const isUnset = value.isUnset()
  const hasName = !!name
  const isExpanded = ctx.isExpanded(value)
  const prefix = hasName ? fmt.key(name) : null
  const suffix = last ? null : ", "

  if (isUnset) {
    ctx.push([prefix, fmt.unset(), suffix], indent)
    return
  }

  if (value instanceof zed.Record) {
    if (isExpanded) {
      ctx.push(
        fmt.expanded([prefix, " {"], () => ctx.setExpanded(value, false)),
        indent
      )
      for (let i = 0; i < value.fields.length; i++) {
        const last = i === value.fields.length - 1
        const f = value.fields[i]
        inspect(ctx, f.value, indent + 1, f.name, last)
      }
      ctx.push(["}", suffix], indent)
    } else {
      let nodes: ReactNode[] = [prefix, "{ "]
      for (var i = 0; i < value.fields.length; ++i) {
        const f = value.fields[i]
        const last = value.fields.length - 1 === i
        nodes.push(inspectOne(f.value, f.name, last))
      }
      nodes.push("}")
      ctx.push(
        fmt.collapsed(nodes, () => ctx.setExpanded(value, true)),
        indent
      )
    }
  }

  if (value instanceof zed.Array) {
    if (isExpanded) {
      ctx.push(
        fmt.expanded([prefix, " ["], () => ctx.setExpanded(value, false)),
        indent
      )
      value.items.forEach((item, i, a) => {
        const last = i === a.length - 1
        inspect(ctx, item, indent + 1, i.toString(), last)
      })
      ctx.push(["]", suffix], indent)
    } else {
      let nodes: ReactNode[] = [prefix, "[ "]
      for (var i = 0; i < value.items.length; ++i) {
        const item = value.items[i]
        const last = value.items.length - 1 === i
        nodes.push(inspectOne(item, null, last))
      }
      nodes.push("}")
      ctx.push(
        fmt.collapsed(nodes, () => ctx.setExpanded(value, true)),
        indent
      )
    }
  }

  ctx.push(inspectOne(value, name, last), indent)
}

export function inspectOne(
  value: zed.AnyValue,
  name: string | null,
  last: boolean
) {
  const isUnset = value.isUnset()
  const hasName = !!name
  const prefix = hasName ? fmt.key(name) : null
  const suffix = last ? null : ", "
  if (isUnset) {
    return [prefix, fmt.unset(), suffix]
  }

  if (value instanceof zed.Record) {
    return [prefix, "Record", suffix]
  }

  if (value instanceof zed.Array) {
    return [prefix, `Array(${value.items.length})`, suffix]
  }

  if (value instanceof zed.String) {
    return [prefix, fmt.string(value.toString()), suffix]
  }

  if (value instanceof zed.Ip) {
    return [prefix, fmt.ip(value.toString()), suffix]
  }

  if (zed.isInt(value)) {
    return [prefix, fmt.int(value.toString()), suffix]
  }

  if (zed.isTime(value)) {
    return [prefix, value.toString(), suffix]
  }
  return null
}
