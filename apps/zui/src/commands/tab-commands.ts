import {invoke} from "src/core/invoke"
import {Active} from "src/models/active"
import {BrowserTab} from "src/models/browser-tab"

export class TabCommands {
  closeActive() {
    if (BrowserTab.count === 0) {
      invoke("closeWindow")
    } else {
      Active.tab.destroy()
    }
  }
}
