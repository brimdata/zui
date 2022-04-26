import {zed} from "@brimdata/zealot"
import {field} from "../templates/field"
import {note} from "../templates/note"
import {syntax} from "../templates/syntax"
import {createView} from "../views/create"
import {ContainerView} from "./container-view"

export class RecordView extends ContainerView<zed.Record> {
  name() {
    return "Record"
  }

  openToken() {
    return "{"
  }

  closeToken() {
    return "}"
  }

  render() {
    const n = 2
    const l = this.value.fields.length
    const trail = l > n ? l - n : null
    const nodes = []
    nodes.push(syntax(this.openToken()))
    nodes.push(Array.from(this.iterate(n)).map(field))
    if (trail) nodes.push(note(" …+" + trail + " "))
    nodes.push(syntax(this.closeToken()))
    return nodes
  }

  *iterate(n?: number) {
    const fields = this.value.fields
    const length = n ? Math.min(n, fields.length) : fields.length

    for (let i = 0; i < fields.length; ++i) {
      const field = fields[i]
      const last = i === length - 1
      yield createView({
        ...this.args,
        value: field.value,
        field,
        last,
        key: field.name,
        type: field.value.type,
        indexPath: [...this.args.indexPath, i],
      })
      if (last) break
    }
  }
}
