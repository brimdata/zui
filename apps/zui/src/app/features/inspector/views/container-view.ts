import {isNumber} from "lodash"
import {closing} from "../templates/closing"
import * as container from "../templates/container"
import {field} from "../templates/field"
import {note} from "../templates/note"
import {opening} from "../templates/opening"
import {syntax} from "../templates/syntax"
import {RenderMode} from "../types"
import {View} from "./view"

export abstract class ContainerView<T = any> extends View<T> {
  abstract name(): string
  abstract count(): number
  abstract openToken(): string
  abstract closeToken(): string
  abstract iterate(n?: number): Generator<View>

  rowCount() {
    if (!this.isExpanded()) return 1
    let sum = 2 // the open and close tokens
    for (let view of this.iterate(this.rowLimit())) sum += view.rowCount()
    if (this.hasMorePages() || this.hasReachedRowLimit()) sum += 2 // the "Next Page/Limit Reached" button
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
    const nodes = []
    const limit = this.ctx.peekLimit
    nodes.push(syntax(this.openToken()))
    for (let view of this.iterate(limit)) {
      nodes.push(field(view, "single"))
    }
    if (this.count() > limit) {
      nodes.push(container.tail(this, limit))
    }
    nodes.push(syntax(this.closeToken()))
    return nodes
  }

  renderLine() {
    const limit = this.ctx.lineLimit
    let nodes = opening(this)
    for (let view of this.iterate(limit)) {
      nodes.push(field(view, "peek"))
    }
    if (this.count() > limit) {
      nodes.push(container.tail(this, limit))
    }
    nodes = nodes.concat(closing(this))
    this.ctx.push(container.expandAnchor(this, nodes))
    return null
  }

  renderExpanded() {
    const {ctx} = this
    ctx.push(container.expandAnchor(this, opening(this)))
    ctx.nest()
    for (let view of this.iterate(this.rowLimit())) {
      view.inspect()
    }
    if (this.hasReachedRowLimit()) {
      ctx.push(container.tail(this, this.rowLimit()))
      ctx.push(container.reachedLimitAnchor(this, ctx.rowsPerPage))
    } else if (this.hasMorePages()) {
      ctx.push(container.tail(this, this.rowLimit()))
      ctx.push(container.nextPageAnchor(this, ctx.rowsPerPage))
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
    const page = this.args.ctx.page(this.id)
    if (!isNumber(page)) throw new Error(this.id)
    const count = page * this.ctx.rowsPerPage
    return Math.min(count, this.ctx.rowLimit)
  }

  hasMorePages() {
    return this.rowLimit() < this.count()
  }

  showNextPage() {
    const current = this.ctx.page(this.id)
    this.ctx.setPage(this.id, current + 1)
  }

  hasReachedRowLimit() {
    return this.count() >= this.ctx.rowLimit
  }

  toggle() {
    this.isExpanded() ? this.collapse() : this.expand()
  }

  expand() {
    this.args.ctx.setIsExpanded(this.id, true)
  }

  collapse() {
    this.args.ctx.setIsExpanded(this.id, false)
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
