import {zed} from "@brimdata/zealot"
import {field} from "../templates/field"
import {note} from "../templates/note"
import {syntax} from "../templates/syntax"
import {createView} from "../views/create"
import {ContainerView} from "./container-view"

export class SetView extends ContainerView<zed.Set> {
  name() {
    return "Set"
  }

  openToken() {
    return "|["
  }

  closeToken() {
    return "]|"
  }

  render() {
    const n = 2
    const l = this.value.items.length
    const trail = l > n ? l - n : null
    const nodes = []
    nodes.push(syntax(this.openToken()))
    nodes.push(Array.from(this.iterate(n)).map(field))
    if (trail) nodes.push(note(" …+" + trail + " "))
    nodes.push(syntax(this.closeToken()))
    return nodes
  }

  *iterate(n?: number) {
    const items = this.value.items
    const length = n ? Math.min(n, items.length) : items.length

    for (let i = 0; i < items.length; ++i) {
      const last = i === length - 1
      yield createView({
        ...this.args,
        value: items[i],
        last,
        key: this.isExpanded() ? i.toString() : null,
        indexPath: [...this.args.indexPath, i],
      })
      if (last) break
    }
  }
}
