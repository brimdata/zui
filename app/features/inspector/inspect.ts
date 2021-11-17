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
    const node = inspectOne(value)
    ctx.push([prefix, node, suffix], indent)
    return
  }

  if (value instanceof zed.Record && isExpanded) {
    ctx.push(
      fmt.expanded({
        children: [prefix, " {"],
        onClick: () => ctx.setExpanded(value, false)
      }),
      indent
    )
    for (let i = 0; i < value.fields.length; i++) {
      const last = i === value.fields.length - 1
      const f = value.fields[i]
      inspect(ctx, f.value, indent + 1, f.name, last)
    }
    ctx.push(["}", suffix], indent)
    return
  }

  if (value instanceof zed.Record && !isExpanded) {
    let nodes: ReactNode[] = [prefix, " {"]
    for (var i = 0; i < value.fields.length; ++i) {
      const f = value.fields[i]
      const last = value.fields.length - 1 === i
      nodes.push([fmt.key(f.name), inspectOne(f.value), last ? null : ", "])
    }
    nodes.push("}")
    ctx.push(
      fmt.collapsed(nodes, () => ctx.setExpanded(value, true)),
      indent
    )
    return
  }

  if (value instanceof zed.Array) {
    if (isExpanded) {
      ctx.push(
        fmt.expanded({
          children: [prefix, " ["],
          onClick: () => ctx.setExpanded(value, false)
        }),
        indent
      )
      value.items.forEach((item, i, a) => {
        const last = i === a.length - 1
        inspect(ctx, item, indent + 1, i.toString(), last)
      })
      ctx.push(["]", suffix], indent)
      return
    } else {
      let nodes: ReactNode[] = [prefix, "[ "]
      for (var i = 0; i < value.items.length; ++i) {
        const item = value.items[i]
        // const last = value.items.length - 1 === i
        nodes.push(inspectOne(item))
      }
      nodes.push("}")
      ctx.push(
        fmt.collapsed(nodes, () => ctx.setExpanded(value, true)),
        indent
      )
      return
    }
  }

  ctx.push([prefix, inspectOne(value), suffix], indent)
}

export function inspectOne(value: zed.AnyValue) {
  const isUnset = value.isUnset()

  if (isUnset) {
    return fmt.unset()
  }

  if (value instanceof zed.Record) {
    return "{...}"
  }

  if (value instanceof zed.Array) {
    return `Array(${value.items.length})`
  }

  if (zed.isStringy(value)) {
    return fmt.string(value.toString())
  }

  if (value instanceof zed.Ip) {
    return fmt.ip(value.toString())
  }

  if (zed.isInt(value)) {
    return fmt.int(value.toString())
  }

  return value.toString()
}
