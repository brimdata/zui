import migrations from "./migrations"
import session from "./session"
import window from "./window"
import windowManager from "./windowManager"

export type Session = ReturnType<typeof session>

export default {
  window,
  windowManager,
  session,
  migrations
}
