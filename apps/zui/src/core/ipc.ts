import {BrowserWindow} from "electron"
import {HandlerName, Handlers} from "src/domain/messages"

export function sendToFocusedWindow<K extends HandlerName>(
  message: K,
  ...args: Parameters<Handlers[K]>
) {
  const win = BrowserWindow.getFocusedWindow()
  if (win) {
    win.webContents.send(message, ...args)
  }
}
