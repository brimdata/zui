import {createHandler} from "src/core/handlers"
import {Active} from "src/models/active"

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
export const submitSearch = createHandler(async () => {
  const {session} = Active
  const nextSnapshot = Active.snapshot

  if (nextSnapshot.equals(session.snapshot)) {
    session.load()
  } else {
    session.navigate(Active.snapshot, session.namedQuery)
  }
})
