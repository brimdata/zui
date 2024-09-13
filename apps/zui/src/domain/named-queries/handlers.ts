import {createHandler} from "src/core/handlers"
import {Active} from "src/models/active"
import {EditorSnapshot} from "src/models/editor-snapshot"
import {NamedQuery} from "src/models/named-query"
import {Session} from "src/models/session"

/**
 * This handler is called when the user submits the form to name their
 * query for the first time.
 */
export const create = createHandler(async ({oldApi}, name: string) => {
  const query = await oldApi.queries.create({name})
  Active.snapshot.update({queryId: query.id})
})

/**
 * This handler is called when the user updates a query to a new version.
 */
export const update = createHandler("namedQueries.update", () => {
  const {session, snapshot} = Active
  const {namedQuery} = session
  const newSnapshot = snapshot.clone({parentId: namedQuery.id})
  newSnapshot.save()
  session.navigate(newSnapshot, namedQuery)
})

/* This handler is called when you want to display a named query in a session */
export const show = createHandler((_, id: string, snapshotId?: string) => {
  const query = NamedQuery.find(id)
  const snapshot = snapshotId
    ? EditorSnapshot.find(query.id, snapshotId)
    : query.lastSnapshot

  Session.activateLastFocused()
  Active.session.navigate(snapshot, query)
})
