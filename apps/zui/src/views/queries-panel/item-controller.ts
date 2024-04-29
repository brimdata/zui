import {filePath} from "src/app/router/utils/paths"
import {ViewHandler} from "src/core/view-handler"
import {Active} from "src/models/active"
import {BrowserTab} from "src/models/browser-tab"
import {EditorSnapshot} from "src/models/editor-snapshot"
import {NamedQuery} from "src/models/named-query"

export class ItemController extends ViewHandler {
  async runQuery(node) {
    if (node.data.path.endsWith(".zed")) {
      const {content} = await this.request("files#show", {path: node.data.path})
      const query = new NamedQuery({id: node.data.path, name: node.data.name})
      const snapshot = new EditorSnapshot({value: content})
      Active.session.navigate(snapshot, query)
    } else {
      BrowserTab.preview(filePath(node.data.path))
    }
  }
}
