import {filePath} from "src/app/router/utils/paths"
import {invoke} from "src/core/invoke"
import {Active} from "src/models/active"
import {BrowserTab} from "src/models/browser-tab"
import {EditorSnapshot} from "src/models/editor-snapshot"

export class ItemController {
  async runQuery(node) {
    if (node.data.path.endsWith(".zed")) {
      const {content} = await invoke("workspaceFiles.read", node.data.path)
      const snapshot = new EditorSnapshot({value: content})
      Active.session.navigate(snapshot)
    } else {
      BrowserTab.preview(filePath(node.data.path))
      // const tab = BrowserTab.create()
      // tab.load(filePath(node.data.path))
      // tab.activate()
    }
  }
}
