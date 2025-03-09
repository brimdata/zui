import {invoke} from "src/core/invoke"
import {BrowserTab} from "src/models/browser-tab"

export class TabsRunner {
  closeActive() {
    if (BrowserTab.count === 0) {
      invoke("closeWindow")
    } else {
      BrowserTab.active?.destroy()
    }
  }
}
