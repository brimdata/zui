import {Active} from "src/models/active"
import {NamedQuery} from "src/models/named-query"
import {Session} from "src/models/session"
import {Snapshot} from "src/models/snapshot"

export class QueriesRunner {
  open(id: string) {
    Session.activateLastFocused()
    const query = NamedQuery.find(id)
    const session = Active.querySession
    const snapshot = Snapshot.create({
      queryId: query.id,
      sessionId: session.id,
      pins: query.pins,
      value: query.value,
    })
    session.tab.load(snapshot.pathname)
  }
}
