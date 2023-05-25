import {sendToFocusedWindow} from "src/core/ipc"
import {PaneName} from "src/js/state/Layout/types"

export class PanesApi {
  activate(name: PaneName) {
    sendToFocusedWindow("panes.activate", name)
  }
}
