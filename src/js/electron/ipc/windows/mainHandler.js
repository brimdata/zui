/* @flow */
import {BrowserWindow, ipcMain} from "electron"
import log from "electron-log"

import type {$WindowManager} from "../../tron/windowManager"

let started = false

export default function(manager: $WindowManager) {
  ipcMain.handle("windows:initialState", (_e, {id}) => {
    return manager.getWindow(id).state
  })

  ipcMain.handle("windows:redirect", (e, args) => {
    BrowserWindow.fromWebContents(e.sender).close()
    manager.openWindow(args.name, args.params)
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

  ipcMain.handle("windows:saveState", (e, id, state) => {
    let win = BrowserWindow.fromWebContents(e.sender)
    manager.updateWindow(id, {
      size: win.getSize(),
      position: win.getPosition(),
      state
    })
  })

  ipcMain.handle("windows:destroy", () => {
    manager.destroyWindow()
  })

  ipcMain.handle("windows:log", (e, {id, args}) => {
    log.info(`[${id}]: `, ...args)
  })
}
