import tabHistory from "src/app/router/tab-history"
import {createHandler} from "src/core/handlers"
import Current from "src/js/state/Current"
import * as zed from "@brimdata/zed-js"
import virusTotal from "src/js/services/virusTotal"
import Modal from "src/js/state/Modal"
import {invoke} from "src/core/invoke"
import {activatePane} from "src/domain/window/handlers"
import Selection from "src/js/state/Selection"

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

export const toggleHistoryPane = createHandler(
  "session.toggleHistoryPane",
  () => activatePane("history")
)

export const showValueDetails = createHandler("session.showValueDetails", () =>
  activatePane("detail")
)

export const showWhoIs = createHandler(
  "session.showWhoIs",
  ({dispatch, select}) => {
    const value = select(Selection.getValue)
    dispatch(Modal.show("whois", {addr: value.toString()}))
  }
)

export const openVirusTotal = createHandler(
  "session.openVirusTotal",
  ({select}) => {
    const value = select(Selection.getValue)
    if (value instanceof zed.Primitive && !value.isUnset()) {
      invoke("openLinkOp", virusTotal.url(value.toString()))
    } else {
      console.error("Could not open this value with virus total")
    }
  }
)
