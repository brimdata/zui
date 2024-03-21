import {createHandler} from "src/core/handlers"
import {Active} from "src/models/active"

export const submitSearch = createHandler(async () => {
  const {session} = Active
  const {lastSnapshot, nextSnapshot} = session

  session.reset()

  if (nextSnapshot.equals(lastSnapshot)) {
    session.load(lastSnapshot.pathname)
  } else {
    nextSnapshot.save()
    session.load(nextSnapshot.pathname)
  }
})
