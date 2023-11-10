import * as handlers from "./handlers"

export type SessionHandlers = {
  "session.goBack": typeof handlers.goBack
  "session.goForward": typeof handlers.goForward
  "session.canGoBack": typeof handlers.canGoBack
  "session.canGoForward": typeof handlers.canGoForward
}
