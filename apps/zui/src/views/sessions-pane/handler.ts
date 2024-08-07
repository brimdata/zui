import {showMenu} from "src/core/menu"
import {ViewHandler} from "src/core/view-handler"
import {QuerySession} from "src/models/query-session"

export class SessionsPaneHandler extends ViewHandler {
  constructor() {
    super()
  }

  showMenu(item: QuerySession) {
    return showMenu([
      {
        label: "Delete",
        click: () => item.destroy(),
      },
    ])
  }
}
