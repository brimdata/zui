import {NamedQuery} from "src/models/named-query"
import {QuerySession} from "src/models/query-session"

export class QueriesRunner {
  open(id: string) {
    const query = NamedQuery.find(id)
    const session = QuerySession.activateOrCreate()
    session.navigate({
      queryId: query.id,
      sessionId: session.id,
      pins: query.pins,
      value: query.value,
    })
  }
}
