import {DomainModel} from "src/core/domain-model"
import Editor from "src/js/state/Editor"
import {QueryPin} from "src/js/state/Editor/types"

type Attrs = {
  version: string
  ts: string // aka lastRanAt
  value: string
  pins: QueryPin[]
}

export class EditorSnapshot extends DomainModel<Attrs> {
  static get current() {
    return new EditorSnapshot(this.select(Editor.getSnapshot))
  }
}
