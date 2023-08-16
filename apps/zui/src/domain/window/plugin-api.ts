import {sendToFocusedWindow} from "src/core/ipc"
import {QueryParams} from "src/js/api/queries/types"

export class WindowApi {
  lakeId: string | null = null

  showErrorMessage(message: string) {
    sendToFocusedWindow("window.showErrorMessage", message)
  }

  showMessage(message: string) {
    sendToFocusedWindow("window.showMessage", message)
  }

  showSuccessMessage(message: string) {
    sendToFocusedWindow("window.showSuccessMessage", message)
  }

  query(params: QueryParams) {
    sendToFocusedWindow("window.query", params)
  }
}
