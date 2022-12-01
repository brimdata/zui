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

const PEEK_LIMIT = 1
const LINE_LIMIT = 2
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
    if (this.isRowLimited()) sum += 2 // the "Render More" button
    return sum
  }

  inspect() {
    if (this.isExpanded()) {
      this.render("expanded")
    } else {
      this.render("line")
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
    let nodes = []
    nodes.push(syntax(this.openToken()))
    for (let view of this.iterate(PEEK_LIMIT)) {
      nodes.push(field(view, "single"))
    }
    if (this.count() > PEEK_LIMIT) {
      nodes.push(container.tail(this, PEEK_LIMIT))
    }
    nodes.push(syntax(this.closeToken()))
    return nodes
  }

  renderLine() {
    const {ctx} = this.args
    let nodes = opening(this)
    for (let view of this.iterate(LINE_LIMIT)) {
      nodes.push(field(view, "peek"))
    }
    if (this.count() > LINE_LIMIT) {
      nodes.push(container.tail(this, LINE_LIMIT))
    }
    nodes = nodes.concat(closing(this))
    ctx.push(container.expandAnchor(this, nodes))
    return null
  }

  renderExpanded() {
    const {ctx} = this.args
    ctx.push(container.expandAnchor(this, opening(this)))
    ctx.nest()
    for (let view of this.iterate(this.rowLimit())) {
      view.inspect()
    }
    if (this.isRowLimited()) {
      ctx.push(container.tail(this, this.rowLimit()))
      ctx.push(container.renderMoreAnchor(this, ROWS_PER_PAGE))
    }
    ctx.unnest()
    ctx.push(closing(this))
    return null
  }

  render(name?: RenderMode) {
    switch (name) {
      case "single":
        return this.renderSingle()
      case "peek":
        return this.renderPeek()
      case "line":
        return this.renderLine()
      case "expanded":
        return this.renderExpanded()
      default:
        throw new Error("A Container Must Have a Render Mode")
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

  toggle() {
    this.isExpanded() ? this.collapse() : this.expand()
  }

  expand() {
    this.args.ctx.props.setExpanded(this.key, true)
  }

  collapse() {
    this.args.ctx.props.setExpanded(this.key, false)
  }

  toggleRecursive() {
    this.isExpanded() ? this.collapseRecursive() : this.expandRecursive()
  }

  expandRecursive() {
    this.expand()
    for (const view of this.iterate()) {
      if (view instanceof ContainerView) view.expandRecursive()
    }
  }

  collapseRecursive() {
    this.collapse()
    for (const view of this.iterate()) {
      if (view instanceof ContainerView) view.collapseRecursive()
    }
  }
}
