import {QueryParams} from "src/js/api/queries/types"
import {showOpenDialog, sync} from "./operations"

export type WindowHandlers = {
  "window.showErrorMessage": (message: string) => void
  "window.showMessage": (message: string) => void
  "window.showSuccessMessage": (message: string) => void
  "window.showWelcomePage": () => void
  "window.query": (params: QueryParams) => void
}

export type WindowOperations = {
  "window.sync": typeof sync
  "window.showOpenDialog": typeof showOpenDialog
}
