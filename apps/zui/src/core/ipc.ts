import {BrowserWindow} from "electron"
import {HandlerName, Handlers} from "src/domain/messages"
import {getMainObject} from "./main"

export function sendToFocusedWindow<K extends HandlerName>(
  message: K,
  ...args: Parameters<Handlers[K]>
) {
  const win = BrowserWindow.getFocusedWindow()
  if (win) {
    win.webContents.send(message, ...args)
  }
}

export function sendToWindow<K extends HandlerName>(
  id: string,
  message: K,
  ...args: Parameters<Handlers[K]>
) {
  const main = getMainObject()
  const win = main.windows.find(id)
  if (win) {
    win.send(message, ...args)
  } else {
    console.error("Could not find window to send message to:", message)
  }
}
