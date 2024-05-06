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
  // const {parentId: _, ...attrs} = Active.snapshot.attrs
  // const query = await oldApi.queries.create({name, versions: [attrs]})
  // const namedQuery = new NamedQuery({
  //   id: query.id,
  //   name: query.name,
  // })
  // Active.session.navigate(namedQuery.lastSnapshot, namedQuery)
  alert("todo")
})

/**
 * This handler is called when the user updates a query to a new version.
 */
export const update = createHandler("namedQueries.update", () => {
  // TODO FOR WORKSPACES
  // const {session, snapshot} = Active
  // const newSnapshot = snapshot.clone({parentId: session.namedQueryId})
  // newSnapshot.save()
  // session.navigate(newSnapshot, session.namedQueryId)
  alert("todo")
})
