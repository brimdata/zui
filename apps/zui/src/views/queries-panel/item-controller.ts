import {invoke} from "src/core/invoke"
import {Active} from "src/models/active"
import {EditorSnapshot} from "src/models/editor-snapshot"

export class ItemController {
  async runQuery(node) {
    console.log(node.data.path)
    if (node.data.path.endsWith(".zed")) {
      const {content} = await invoke("workspaceFiles.read", node.data.path)
      const snapshot = new EditorSnapshot({value: content})
      Active.session.navigate(snapshot)
    }
  }
}
