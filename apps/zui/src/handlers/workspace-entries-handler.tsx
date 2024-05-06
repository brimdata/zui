import {filePath} from "src/app/router/utils/paths"
import {ViewHandler} from "src/core/view-handler"
import {Active} from "src/models/active"
import {BrowserTab} from "src/models/browser-tab"
import {EditorSnapshot} from "src/models/editor-snapshot"
import {NamedQuery} from "src/models/named-query"
import {Workspace} from "src/models/workspace"

export class WorkspaceEntriesHandler extends ViewHandler {
  constructor(public id: string) {
    super()
  }

  async activate(path: string) {
    if (path.endsWith(".zed")) {
      const namedQuery = await NamedQuery.read(path)
      const snapshot = new EditorSnapshot({
        value: namedQuery.text,
        parentId: namedQuery.id,
      })
      Active.session.navigate(snapshot, namedQuery.id)
    } else {
      BrowserTab.preview(filePath(path))
    }
  }

  async requestEntries() {
    if (this.id) {
      const workspace = Workspace.find(this.id)
      await this.request("files#index", {path: workspace.attrs.path})
    } else {
      return []
    }
  }
}
