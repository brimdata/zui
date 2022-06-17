import {zed} from "@brimdata/zealot"
import {closing} from "../templates/closing"
import * as container from "../templates/container"
import {field} from "../templates/field"
import {note} from "../templates/note"
import {opening} from "../templates/opening"
import {syntax} from "../templates/syntax"
import {RenderMode} from "../types"
import {View} from "./view"

export abstract class ContainerView<
  T extends zed.Any = zed.Any
> extends View<T> {
  abstract name(): string
  abstract count(): number
  abstract openToken(): string
  abstract closeToken(): string
  abstract iterate(n?: number): Generator<View<zed.Any>>

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
      for (let view of this.iterate()) line.push(field(view, "peek"))
      line = line.concat(closing(this))
      ctx.push(container.anchor(this, line))
    }
  }

  // Update ErrorView when you update this.
  renderSingle() {
    return [
      syntax(this.openToken()),
      note("…" + this.count()),
      syntax(this.closeToken()),
    ]
  }

  renderPeek() {
    const n = 2
    const l = this.count()
    const trail = l > n ? l - n : null
    const nodes = []
    nodes.push(syntax(this.openToken()))
    nodes.push(Array.from(this.iterate(n)).map((v) => field(v, "single")))
    if (trail) nodes.push(note(" …+" + trail + " "))
    nodes.push(syntax(this.closeToken()))
    return nodes
  }

  render(name?: RenderMode) {
    switch (name) {
      case "single":
        return this.renderSingle()
      case "peek":
        return this.renderPeek()
      default:
        return this.renderSingle()
    }
  }
}
