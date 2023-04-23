import {BrowserWindow} from "electron"
import {MessageName, Messages} from "src/domain/messages"

export function sendToFocusedWindow<K extends MessageName>(
  message: K,
  ...args: Messages[K]
) {
  const win = BrowserWindow.getFocusedWindow()
  if (win) {
    win.webContents.send(message, ...args)
  }
}
