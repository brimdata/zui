import session from "./session"
import window from "./window"

export type Session = ReturnType<typeof session>

export default {
  window,
  session,
}
