import React, {ReactNode} from "react"
import {inspect} from "./inspect"
import {inspectOne} from "./inspect-one"
import * as fmt from "./format"

export function inspectContainer(ctx, value, indent, name, last, opts) {
  const {iterate, expanded, collapsed} = opts
  const hasName = !!name
  const isExpanded = ctx.isExpanded(value)
  const prefix = hasName ? fmt.key(name) : null
  const suffix = last ? null : ", "
  const open = <span key="open">{opts.open}</span>
  const close = <span key="close">{opts.close}</span>

  if (isExpanded) {
    ctx.push(
      fmt.expanded({
        children: [prefix, open],
        onClick: () => ctx.setExpanded(value, false)
      }),
      indent
    )
    iterate.forEach((d, i, a) => {
      const last = i === a.length - 1
      const value = expanded.value(d, i)
      const name = expanded.field(d, i)
      inspect(ctx, value, indent + 1, name, last)
    })
    ctx.push([close, suffix], indent)
  } else {
    let nodes: ReactNode[] = [prefix, open]
    iterate.forEach((d, i, a) => {
      const last = i === a.length - 1
      const value = collapsed.value(d, i)
      const name = collapsed.field(d, i)
      const prefix = name ? fmt.key(name) : null
      const suffix = last ? null : ", "
      nodes.push([prefix, inspectOne(ctx, value, name), suffix])
    })
    nodes.push(close)
    ctx.push(
      fmt.collapsed(nodes, () => ctx.setExpanded(value, true)),
      indent
    )
  }
}

export function inspectIndexedContainer(ctx, value, indent, field, last, opts) {
  const isExpanded = ctx.isExpanded(value)
  const prefix = field ? fmt.key(field) : null
  const suffix = last ? null : ", "
  const {iterate} = opts
  const open = <span key="open">{opts.open}</span>
  const close = <span key="close">{opts.close}</span>

  if (isExpanded) {
    ctx.push(
      fmt.expanded({
        children: [prefix, open],
        onClick: () => ctx.setExpanded(value, false)
      }),
      indent
    )
    iterate.forEach((d, i, a) => {
      const last = i === a.length - 1
      inspect(ctx, d, indent + 1, i.toString(), last)
    })
    ctx.push([close, suffix], indent)
  } else {
    let nodes: ReactNode[] = [prefix, open]
    iterate.forEach((d, i, a) => {
      const last = i === a.length - 1
      const suffix = last ? null : ", "
      nodes.push([inspectOne(ctx, d, field), suffix])
    })
    nodes.push(close)
    ctx.push(
      fmt.collapsed(nodes, () => ctx.setExpanded(value, true)),
      indent
    )
  }
}
