import {zed} from "@brimdata/zealot"
import {field} from "../templates/field"
import {note} from "../templates/note"
import {syntax} from "../templates/syntax"
import {createView} from "../views/create"
import {ContainerView} from "./container-view"

export class MapView extends ContainerView<zed.Map> {
  name() {
    return "Map"
  }

  openToken() {
    return "|{"
  }

  closeToken() {
    return "}|"
  }

  render() {
    const n = 2
    const l = this.value.value.size
    const trail = l > n ? l - n : null
    const nodes = []
    nodes.push(syntax(this.openToken()))
    nodes.push(Array.from(this.iterate(n)).map(field))
    if (trail) nodes.push(note(" …+" + trail + " "))
    nodes.push(syntax(this.closeToken()))
    return nodes
  }

  *iterate(n?: number) {
    const map = this.value.value
    const length = n ? Math.min(n, map.size) : map.size

    let i = 0
    for (let key of map.keys()) {
      const last = i === length - 1
      yield createView({
        ...this.args,
        value: map.get(key),
        last,
        key: key,
        indexPath: [...this.args.indexPath, i]
      })
      if (last) break
      i++
    }
  }
}
