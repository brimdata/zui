import {ViewHandler} from "src/core/view-handler"
import {Active} from "src/models/active"
import {Snapshot} from "src/models/snapshot"

export class HistoryHandler extends ViewHandler {
  entries: Snapshot[]

  constructor() {
    super()
    this.entries = Snapshot.useAll()
  }

  onClick(id: string) {
    const snapshot = Snapshot.find(id)
    Active.querySession.tab.load(snapshot.pathname)
  }
}
