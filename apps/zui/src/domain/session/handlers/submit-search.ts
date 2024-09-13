import {createHandler} from "src/core/handlers"
import Editor from "src/js/state/Editor"
import {Active} from "src/models/active"
import {Snapshot} from "src/models/snapshot"

/**
 * Save the active snapshot under the session id.
 *
 * Redirect the app to the previous parent id,
 * but the active snapshot id that was just saved.
 *
 * The session page is essentially a form to create
 * a new editor snapshot under that session id.
 *
 * It's should be thought of as POST /session/:id/snapshots
 */
export const submitSearch = createHandler(async ({select}) => {
  const session = Active.session
  const currentSnapshot = Active.snapshot
  const nextSnapshot = new Snapshot({
    ...select(Editor.getSnapshot),
    sessionId: session.id,
  })

  if (currentSnapshot.equals(nextSnapshot)) {
    Active.tab.reload()
  } else {
    nextSnapshot.save()
    session.navigate(nextSnapshot)
  }
})
