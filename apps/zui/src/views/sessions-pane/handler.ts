import {useSelector} from "react-redux"
import {ViewHandler} from "src/core/view-handler"
import SessionHistories from "src/js/state/SessionHistories"
import Tabs from "src/js/state/Tabs"
import {BrowserTab} from "src/models/browser-tab"
import {SessionEntry} from "src/models/session-entry"

export class SessionsPaneHandler extends ViewHandler {
  sessions: SessionEntry[]

  constructor() {
    super()
    useSelector(SessionHistories.raw)
    this.activeTabId = useSelector(Tabs.getActive)
    this.sessions = useSelector(SessionEntry.selectors.all)
      .map((attrs) => new SessionEntry(attrs))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  isOpen(session) {
    return session.id == this.activeTabId
  }

  activate(session) {
    BrowserTab.find(session.id).activate()
  }
}
