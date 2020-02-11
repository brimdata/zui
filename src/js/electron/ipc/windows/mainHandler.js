/* @flow */
import {BrowserWindow, ipcMain} from "electron"

import type {$WindowManager} from "../../tron/windowManager"

export default function(manager: $WindowManager) {
  ipcMain.handle("windows:redirect", (e, args) => {
    BrowserWindow.fromWebContents(e.sender).close()
    manager.openWindow(args.name, args.params)
  })

  ipcMain.handle("windows:close", () => {
    manager.closeWindow()
  })
}
