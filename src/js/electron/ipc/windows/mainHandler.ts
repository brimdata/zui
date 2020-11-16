import log from "electron-log"

import {BrowserWindow, dialog, ipcMain} from "electron"

import {$WindowManager} from "../../tron/windowManager"

let started = false

export default function(manager: $WindowManager) {
  ipcMain.handle("windows:initialState", (_e, {id}) => {
    const window = manager.getWindow(id)

    return window.initialState
  })

  ipcMain.handle("windows:open", (e, args) => {
    manager.openWindow(args.name, args.params, args.state)
  })

  ipcMain.handle("windows:close", () => {
    manager.closeWindow()
  })

  ipcMain.handle("windows:ready", () => {
    if (!started) {
      console.timeEnd("init")
      started = true
    }
  })

  ipcMain.handle("windows:newSearchTab", (e, params) => {
    manager.openSearchTab(params.params)
  })

  ipcMain.handle("windows:log", (e, {id, args}) => {
    log.info(`[${id}]: `, ...args)
  })

  ipcMain.handle("windows:openDirectorySelect", async (e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    return await dialog.showOpenDialog(win, {
      properties: ["openDirectory"]
    })
  })

  ipcMain.handle("windows:showSaveDialog", async (e, args) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    return dialog.showSaveDialog(win, args)
  })
}
