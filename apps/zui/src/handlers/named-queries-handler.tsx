import {ViewHandler} from "src/core/view-handler"
import {Active} from "src/models/active"
import {EditorSnapshot} from "src/models/editor-snapshot"

export class NamedQueriesHandler extends ViewHandler {
  show(queryId: string, snapshotId: string) {
    const snapshot = EditorSnapshot.find(queryId, snapshotId)
    Active.session.navigate(snapshot, queryId)
  }
}
