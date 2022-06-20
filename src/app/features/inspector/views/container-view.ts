import {zed} from "@brimdata/zealot"
import {isNumber} from "lodash"
import {closing} from "../templates/closing"
import * as container from "../templates/container"
import {field} from "../templates/field"
import {note} from "../templates/note"
import {opening} from "../templates/opening"
import {syntax} from "../templates/syntax"
import {RenderMode} from "../types"
import {View} from "./view"

const PEEK_LIMIT = 2
const LINE_LIMIT = 15
const ROWS_PER_PAGE = 100
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
    let sum = 2 // the open and close tokens
    for (let view of this.iterate(this.rowLimit())) sum += view.rowCount()
    if (this.isRowLimited()) sum += 1 // the "Render More" button
    return sum
  }

  inspect() {
    const {ctx} = this.args

    if (this.isExpanded()) {
      ctx.push(container.expandAnchor(this, opening(this)))
      ctx.nest()
      for (let view of this.iterate(this.rowLimit())) view.inspect()
      if (this.isRowLimited()) {
        ctx.push(container.renderMoreAnchor(this, ROWS_PER_PAGE, this.count()))
      }
      ctx.unnest()
      ctx.push(closing(this))
    } else {
      ctx.push(this.renderLine())
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
    const trail = this.count() > PEEK_LIMIT ? this.count() - PEEK_LIMIT : null
    const nodes = []
    nodes.push(syntax(this.openToken()))
    nodes.push(
      Array.from(this.iterate(PEEK_LIMIT)).map((v) => field(v, "single"))
    )
    if (trail) nodes.push(note(" …+" + trail + " "))
    nodes.push(syntax(this.closeToken()))
    return nodes
  }

  renderLine() {
    const trail = this.count() > LINE_LIMIT ? this.count() - LINE_LIMIT : null
    let line = opening(this)
    for (let view of this.iterate(LINE_LIMIT)) line.push(field(view, "peek"))
    if (trail) line.push(note(" …+" + trail + " "))
    line = line.concat(closing(this))
    return container.expandAnchor(this, line)
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

  rowLimit() {
    const page = this.args.ctx.props.getValuePage(this.key)
    if (!isNumber(page)) throw new Error(this.key)
    return page * ROWS_PER_PAGE
  }

  isRowLimited() {
    return this.rowLimit() < this.count()
  }
}
