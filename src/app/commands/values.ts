import * as zed from "@brimdata/zed-js"
import {viewLogDetail} from "src/js/flows/viewLogDetail"
import virusTotal from "src/js/services/virusTotal"
import Modal from "src/js/state/Modal"
import {createCommand} from "./command"

export const showValueDetails = createCommand(
  "showValueDetails",
  ({api, dispatch}, value: zed.Any) => {
    dispatch(viewLogDetail(value as zed.Record))
    api.layout.activatePane("detail")
  }
)

export const showWhoIs = createCommand(
  "showWhoIs",
  ({dispatch}, value: zed.Any) => {
    dispatch(Modal.show("whois", {addr: value.toString()}))
  }
)

export const openVirusTotal = createCommand(
  "openVirusTotal",
  (_ctx, value: zed.Any) => {
    if (value instanceof zed.Primitive && !value.isUnset()) {
      global.zui.invoke("openLinkOp", virusTotal.url(value.toString()))
    }
  }
)
