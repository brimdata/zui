import {useMemo} from "react"
import {ViewHandler} from "src/core/view-handler"
import {Active} from "src/models/active"
import {Snapshot} from "src/models/snapshot"

export class HistoryHandler extends ViewHandler {
  entries: Snapshot[]

  constructor() {
    super()
    this.entries = this.useEntries()
  }

  useEntries() {
    const snapshots = Snapshot.useAll()
    return useMemo(() => snapshots.slice(0).reverse(), [snapshots])
  }

  onActivate(id: string) {
    const snapshot = Snapshot.find(id)
    Active.querySession.tab.load(snapshot.pathname)
  }
}
