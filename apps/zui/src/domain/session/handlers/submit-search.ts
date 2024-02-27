import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import QueryVersions from "../../../js/state/QueryVersions"
import Table from "src/js/state/Table"
import Inspector from "src/js/state/Inspector"
import {createHandler} from "src/core/handlers"
import Selection from "src/js/state/Selection"

export const submitSearch = createHandler(async (ctx) => {
  const {dispatch, select, oldApi} = ctx
  const api = oldApi

  dispatch(Selection.reset())
  dispatch(Table.setScrollPosition({top: 0, left: 0}))
  dispatch(Inspector.setScrollPosition({top: 0, left: 0}))

  const nextVersion = select(Editor.getSnapshot)
  const active = select(Current.getActiveQuery)

  // Reuse the version url if the next version is the same as the latest
  // of this query, either session or saved.
  if (QueryVersions.areEqual(active.version, nextVersion)) {
    api.queries.open(active.id(), {version: active.versionId()})
    return
  }

  // This is a new query, add a new version to the session,
  // And open the current active query with the version set to the new one.
  api.queries.addVersion(active.session.id, nextVersion)
  api.queries.open(active.id(), {version: nextVersion.version})
})
