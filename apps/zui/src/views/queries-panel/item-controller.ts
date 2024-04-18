import {invoke} from "src/core/invoke"
import {Active} from "src/models/active"
import {EditorSnapshot} from "src/models/editor-snapshot"

export class ItemController {
  async runQuery(node) {
    const {content} = await invoke("workspaceFiles.show", node.data.path)
    const snapshot = new EditorSnapshot({value: content})
    Active.session.navigate(snapshot)
  }
}
