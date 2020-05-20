/* @flow */
import {BrowserWindow, dialog, ipcMain} from "electron"
import log from "electron-log"

import type {$WindowManager} from "../../tron/windowManager"

let started = false

export default function(manager: $WindowManager) {
  ipcMain.handle("windows:initialState", (_e, {id}) => {
    const window = manager.getWindow(id)

    return window.state
  })

  ipcMain.handle("windows:open", (e, args) => {
    const {id} = manager.openWindow(args.name, args.params)

    manager.updateWindow(id, {state: args.state})

    return id
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

  ipcMain.handle("windows:saveState", (e, id, state) => {
    let win = BrowserWindow.fromWebContents(e.sender)
    manager.updateWindow(id, {
      size: win.getSize(),
      position: win.getPosition(),
      state
    })
  })

  ipcMain.handle("windows:destroy", (e) => {
    let win = BrowserWindow.fromWebContents(e.sender)
    manager.destroyWindow(win)
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
}
