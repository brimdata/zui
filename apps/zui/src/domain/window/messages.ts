import * as ops from "./operations"
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
  "window.sync": typeof ops.sync
  "window.showOpenDialog": typeof ops.showOpenDialog
  "window.close": typeof ops.close
}
