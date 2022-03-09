import {zed} from "@brimdata/zealot"
import * as container from "../templates/container"
import {field} from "../templates/field"
import {key} from "../templates/key"
import {space} from "../templates/space"
import {typename} from "../templates/typename"
import {View} from "./view"

export abstract class ContainerView<T extends zed.Any = zed.Any> extends View<
  T
> {
  abstract name(): string
  abstract openToken(): string
  abstract closeToken(): string
  abstract iterate(): Generator<View<zed.Any>>

  rowCount() {
    if (!this.isExpanded()) return 1
    let sum = 2
    for (let view of this.iterate()) sum += view.rowCount()
    return sum
  }

  inspect() {
    const {ctx} = this.args

    if (this.isExpanded()) {
      ctx.push(container.anchor(this, opening(this)))
      ctx.nest()
      for (let view of this.iterate()) view.inspect()
      ctx.unnest()
      ctx.push(closing(this))
    } else {
      let line = opening(this)
      for (let view of this.iterate()) line.push(field(view))
      line = line.concat(closing(this))
      ctx.push(container.anchor(this, line))
    }
  }
}

function closing(view: ContainerView) {
  let nodes = []
  nodes.push(container.close(view))
  if (zed.isTypeAlias(view.args.type)) nodes.push(typename(view))
  if (!view.args.last) nodes.push(",")
  return nodes
}

function opening(view: ContainerView) {
  const nodes = []
  if (view.args.key) {
    nodes.push(key(view))
  }
  nodes.push(container.icon(view))
  nodes.push(container.name(view))
  nodes.push(space())
  nodes.push(container.open(view))
  return nodes
}
