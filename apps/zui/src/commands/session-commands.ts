import tabHistory from "src/app/router/tab-history"
import {ViewCommands} from "src/core/view-commands"

export class SessionCommands extends ViewCommands {
  goBack() {
    this.dispatch(tabHistory.goBack())
  }

  goForward() {
    this.dispatch(tabHistory.goForward())
  }

  detachQuery() {}
}
