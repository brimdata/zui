import {DomainModel} from "src/core/domain-model"
import Queries from "src/js/state/Queries"
import {EditorSnapshot} from "./editor-snapshot"

type Attrs = {
  name: string
  id: string
}

export class NamedQuery extends DomainModel<Attrs> {
  static find(id: string) {
    const attrs = this.select((state) => Queries.find(state, id))
    if (!attrs) return null
    const {name} = attrs
    return new NamedQuery({id, name})
  }

  get id() {
    return this.attrs.id
  }

  get lastSnapshot() {
    return this.snapshots[this.snapshots.length - 1]
  }

  get snapshots() {
    return EditorSnapshot.where({parentId: this.attrs.id})
  }
}
