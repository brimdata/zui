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

    const line = []
    if (this.args.key) {
      line.push(key(this))
    }
    line.push(container.icon(this))
    line.push(container.name(this))
    line.push(space())
    line.push(container.open(this))

    if (this.isExpanded()) {
      ctx.push(container.anchor(this, line))
      ctx.nest()
      for (let view of this.iterate()) view.inspect()
      ctx.unnest()
      ctx.push(container.close(this))
    } else {
      for (let view of this.iterate()) line.push(field(view))
      line.push(container.close(this))
      if (zed.isTypeAlias(this.args.type)) line.push(typename(this))
      ctx.push(container.anchor(this, line))
    }
  }
}
