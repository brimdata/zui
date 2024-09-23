import {Active} from "src/models/active"
import {NamedQuery} from "src/models/named-query"
import {QuerySession} from "src/models/query-session"
import {Snapshot} from "src/models/snapshot"

export class QueriesRunner {
  open(id: string) {
    QuerySession.activateOrCreate()
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
