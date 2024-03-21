import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import QueryVersions from "../../../js/state/QueryVersions"
import {createHandler} from "src/core/handlers"
import {Active} from "src/models/active"

export const submitSearch = createHandler(async (ctx) => {
  const {select, oldApi} = ctx
  const api = oldApi
  const {querySession} = Active

  querySession.reset()

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
  api.queries.createEditorSnapshot(active.session.id, nextVersion)
  api.queries.open(active.id(), {version: nextVersion.version})
})
