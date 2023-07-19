import {sendToFocusedWindow} from "src/core/ipc"

export class WindowApi {
  showErrorMessage(message: string) {
    sendToFocusedWindow("window.showErrorMessage", message)
  }

  showMessage(message: string) {
    sendToFocusedWindow("window.showMessage", message)
  }

  showSuccessMessage(message: string) {
    sendToFocusedWindow("window.showSuccessMessage", message)
  }
}
