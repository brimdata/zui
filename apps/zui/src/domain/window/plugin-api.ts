import {sendToWindow} from "src/core/ipc"

export class WindowApi {
  id: string | null = null
  lakeId: string | null = null

  showErrorMessage(message: string) {
    sendToWindow(this.id, "window.showErrorMessage", message)
  }

  showMessage(message: string) {
    sendToWindow(this.id, "window.showMessage", message)
  }

  showSuccessMessage(message: string) {
    sendToWindow(this.id, "window.showSuccessMessage", message)
  }

  sync(args: {id: string; lakeId: string}) {
    this.id = args.id
    this.lakeId = args.lakeId
  }

  openTab(path: string) {
    sendToWindow(this.id, "window.openTab", path)
  }
}
