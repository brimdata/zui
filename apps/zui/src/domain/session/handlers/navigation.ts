import tabHistory from "src/app/router/tab-history"
import {createHandler} from "src/core/handlers"
import Current from "src/js/state/Current"

export const goBack = createHandler("session.goBack", ({dispatch}) => {
  dispatch(tabHistory.goBack())
})

export const goForward = createHandler("session.goForward", ({dispatch}) => {
  dispatch(tabHistory.goForward())
})

export const canGoBack = createHandler("session.canGoBack", ({select}) => {
  return select(Current.getHistory).canGo(-1)
})

export const canGoForward = createHandler(
  "session.canGoForward",
  ({select}) => {
    return select(Current.getHistory).canGo(1)
  }
)
