import * as handlers from "./handlers"

export type SessionHandlers = {
  "session.goBack": typeof handlers.goBack
  "session.goForward": typeof handlers.goForward
  "session.canGoBack": typeof handlers.canGoBack
  "session.canGoForward": typeof handlers.canGoForward
  "session.createPinFromEditor": typeof handlers.createPinFromEditor
  "session.editQuery": typeof handlers.editQuery
  "session.runQuery": typeof handlers.runQuery
  "session.toggleHistoryPane": typeof handlers.toggleHistoryPane
  "session.createFromPin": typeof handlers.createFromPin
  "session.createPin": typeof handlers.createPin
  "session.setFromPin": typeof handlers.setFromPin
  "session.createTimeRangePin": typeof handlers.createTimeRangePin
  "session.setTimeRangeFrom": typeof handlers.setTimeRangeFrom
  "session.setTimeRangeTo": typeof handlers.setTimeRangeTo
  "session.showWhoIs": typeof handlers.showWhoIs
  "session.openVirusTotal": typeof handlers.openVirusTotal
  "session.showValueDetails": typeof handlers.showValueDetails
  "session.focusEditor": typeof handlers.focusEditor
}
