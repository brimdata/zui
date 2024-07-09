import {ViewHandler} from "src/core/view-handler"
import {openLogDetailsWindow} from "src/js/flows/openLogDetailsWindow"
import * as zed from "@brimdata/zed-js"
import LogDetails from "src/js/state/LogDetails"
import {useSelector} from "react-redux"
import {LogDetailHistory} from "src/js/state/LogDetails/reducer"
import {StateObject, useStateObject} from "src/core/state-object"

const initial = {expanded: {}, page: {}}

export class DetailPaneHandler extends ViewHandler {
  history: LogDetailHistory
  state: StateObject<typeof initial>

  constructor(public value: zed.Value) {
    super()
    this.history = useSelector(LogDetails.getHistory)
    this.state = useStateObject(initial)
  }

  openInNewWindow() {
    this.dispatch(openLogDetailsWindow(this.value))
  }

  goBack() {
    this.dispatch(LogDetails.back())
  }

  goForward() {
    this.dispatch(LogDetails.forward())
  }

  canGoBack() {
    return this.history.canGoBack()
  }

  canGoForward() {
    return this.history.canGoForward()
  }
}
