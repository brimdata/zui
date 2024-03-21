import {DomainModel} from "src/core/domain-model"
import Editor from "src/js/state/Editor"
import {EditorSnapshot} from "./editor-snapshot"
import {QuerySession} from "./query-session"
import Current from "src/js/state/Current"

export class Active extends DomainModel<void> {
  static get editorSnapshot() {
    return new EditorSnapshot(this.select(Editor.getSnapshot))
  }

  static get querySession() {
    return new QuerySession({id: this.select(Current.getTabId)})
  }
}
