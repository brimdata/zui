import {filePath} from "src/app/router/utils/paths"
import {ViewHandler} from "src/core/view-handler"
import {Active} from "src/models/active"
import {BrowserTab} from "src/models/browser-tab"
import {EditorSnapshot} from "src/models/editor-snapshot"
import {NamedQuery} from "src/models/named-query"
import {Workspace} from "src/models/workspace"
import {Props} from "./index"
import {WorkspaceEntriesState} from "./state"
import {TreeModel} from "react-arborist-v4"

export class WorkspaceEntriesHandler extends ViewHandler {
  tree: TreeModel<any>

  constructor(public props: Props, public state: WorkspaceEntriesState) {
    super()
    this.tree = new TreeModel(this.state.data, {
      id: (d) => d.path,
      isLeaf: (d) => !d.isDir,
      sortBy: [(d) => d.isDir, (d) => d.name],
      sortOrder: ["desc", "asc"],
    })
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

  async refresh() {
    if (this.props.id) {
      const workspace = Workspace.find(this.props.id)
      this.state.setItem(
        "data",
        await this.request("files#index", {path: workspace.attrs.path})
      )
    }
  }

  onNodesChange(e) {
    this.tree[e.type](e)
    this.state.setItem("data", [...this.tree.sourceData])
  }

  async onOpensChange(e) {
    for (const id of e.ids) {
      const node = this.tree.find(id)
      const files = await this.request("files#index", {
        path: node.sourceData.path,
      })
      node.setChildren(files)
      this.renderTree()
    }
    this.state.setItem("opens", e.value)
  }

  async onClick(node) {
    const {path} = node.data
    if (path.endsWith(".zed")) {
      const namedQuery = await NamedQuery.read(path)
      Active.session.navigate(namedQuery.snapshot, namedQuery.id)
    } else {
      BrowserTab.preview(filePath(path))
    }
  }

  renderTree() {
    this.state.setItem("data", [...this.tree.sourceData])
  }
}
