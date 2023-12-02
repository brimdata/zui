import tabHistory from "src/app/router/tab-history"
import {createHandler} from "src/core/handlers"
import Current from "src/js/state/Current"
import * as zed from "@brimdata/zed-js"
import {viewLogDetail} from "src/js/flows/viewLogDetail"
import virusTotal from "src/js/services/virusTotal"
import Modal from "src/js/state/Modal"
import {invoke} from "src/core/invoke"
import {activatePane} from "src/domain/window/handlers"

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
  () => {
    activatePane("history")
  }
)

export const showValueDetails = createHandler(
  "session.showValueDetails",
  ({dispatch}, value: zed.Value) => {
    dispatch(viewLogDetail(value as zed.Record))
    activatePane("detail")
  }
)

export const showWhoIs = createHandler(
  "session.showWhoIs",
  ({dispatch}, value: zed.Type) => {
    dispatch(Modal.show("whois", {addr: value.toString()}))
  }
)

export const openVirusTotal = createHandler(
  "session.openVirusTotal",
  (_ctx, value: zed.Type) => {
    if (value instanceof zed.Primitive && !value.isUnset()) {
      invoke("openLinkOp", virusTotal.url(value.toString()))
    }
  }
)
