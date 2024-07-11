import {useSelector} from "react-redux"
import {ViewHandler} from "src/core/view-handler"
import {Session} from "src/models/session"

export class SessionsPaneHandler extends ViewHandler {
  sessions: Session[]

  constructor() {
    super()
    this.sessions = useSelector(Session.selectAll).sort(
      (a, b) => a.tab.attrs.lastFocused - b.tab.attrs.lastFocused
    )
  }
}
