import {MemoryHistory} from "history"
import {queryPath} from "src/app/router/utils/paths"
import {DomainModel} from "src/core/domain-model"
import Inspector from "src/js/state/Inspector"
import Table from "src/js/state/Table"
import Selection from "src/js/state/Selection"
import {EditorSnapshot} from "./editor-snapshot"
import Editor from "src/js/state/Editor"
import {SessionHistory} from "./session-history"

type Attrs = {
  id: string
  queryId: string
  editorSnapshotId: string
}

export class Session extends DomainModel<Attrs> {
  get pathname() {
    return queryPath(this.attrs.queryId, this.attrs.editorSnapshotId)
  }

  get snapshots() {
    return EditorSnapshot.where({parentId: this.attrs.id})
  }

  get lastSnapshot() {
    return this.snapshots[this.snapshots.length - 1]
  }

  get nextSnapshot() {
    return new EditorSnapshot({
      parentId: this.attrs.id,
      ...this.select(Editor.getSnapshot),
    })
  }

  get history() {
    return new SessionHistory({id: this.attrs.id})
  }

  load(pathname: string) {
    if (this.tabHistory.location.pathname === pathname) {
      this.tabHistory.replace(pathname)
    } else {
      this.tabHistory.push(pathname)
    }
  }

  reset() {
    this.dispatch(Selection.reset())
    this.dispatch(Table.setScrollPosition({top: 0, left: 0}))
    this.dispatch(Inspector.setScrollPosition({top: 0, left: 0}))
  }

  private get tabHistory(): MemoryHistory {
    return global.tabHistories.getOrCreate(this.attrs.id)
  }
}
