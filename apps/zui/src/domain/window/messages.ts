import {showOpenDialog, sync} from "./operations"
import * as handlers from "./handlers"

export type WindowHandlers = {
  "window.showErrorMessage": typeof handlers.showErrorMessage
  "window.showMessage": typeof handlers.showMessage
  "window.showSuccessMessage": typeof handlers.showSuccessMessage
  "window.showWelcomePage": typeof handlers.showWelcomePage
  "window.query": typeof handlers.query
  "window.openTab": typeof handlers.openTab
}

export type WindowOperations = {
  "window.sync": typeof sync
  "window.showOpenDialog": typeof showOpenDialog
}
