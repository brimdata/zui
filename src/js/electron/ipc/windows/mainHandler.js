/* @flow */
import {BrowserWindow, ipcMain} from "electron"

import type {$WindowManager} from "../../tron"

export default function(manager: $WindowManager) {
  ipcMain.handle("windows:redirect", (e, args) => {
    BrowserWindow.fromWebContents(e.sender).close()
    manager.open(args.name, args.params)
  })

  ipcMain.handle("windows:close", () => {
    manager.closeWindow()
  })
}
