import {formatDistanceToNowStrict} from "date-fns"
import {useMemo} from "react"
import {useSelector} from "react-redux"
import {ViewHandler} from "src/core/view-handler"
import Current from "src/js/state/Current"
import Queries from "src/js/state/Queries"
import {QuerySession} from "src/models/query-session"
import {Snapshot} from "src/models/snapshot"

export class HistoryHandler extends ViewHandler {
  entries: Snapshot[]

  constructor() {
    super()
    this.entries = this.useEntries()
  }

  useEntries() {
    const sessionId = useSelector(Current.getSnapshot)?.sessionId
    const snapshots = Snapshot.useWhere({sessionId})
    const _queries = useSelector(Queries.raw)
    return useMemo(() => snapshots.slice(0).reverse(), [snapshots])
  }

  onActivate(id: string) {
    const snapshot = Snapshot.find(id)
    QuerySession.load(snapshot)
  }

  formatTimestamp(date: Date) {
    if (!date) return "-"
    try {
      let text = formatDistanceToNowStrict(date)
      if (/second/.test(text)) return "now"
      else return text.replace("second", "sec").replace("minute", "min")
    } catch (e) {
      console.error(e)
      return ""
    }
  }
}
