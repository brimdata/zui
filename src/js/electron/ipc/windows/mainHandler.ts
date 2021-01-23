import log from "electron-log"
import {BrowserWindow, dialog, ipcMain} from "electron"
import {Brim} from "../../brim"
import keytar from "keytar"
import * as os from "os"

let started = false

export default function(brim: Brim) {
  ipcMain.handle("windows:initialState", (_e, {id}) => {
    const window = brim.windows.getWindow(id)

    return window.initialState
  })

  ipcMain.handle("windows:open", (e, args) => {
    brim.windows.openWindow(args.name, args.params, args.state)
  })

  ipcMain.handle("windows:close", () => {
    brim.windows.closeWindow()
  })

  ipcMain.handle("windows:ready", () => {
    if (!started) {
      console.timeEnd("init")
      started = true
    }
  })

  ipcMain.handle("windows:newSearchTab", (e, params) => {
    brim.windows.openSearchTab(params.params)
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

  ipcMain.handle("windows:setKeyStorage", async (e, {key, val}) => {
    return keytar.setPassword(os.userInfo().username, key, val)
  })
  ipcMain.handle("windows:getKeyStorage", async (e, key) => {
    return keytar.getPassword(os.userInfo().username, key)
  })
  ipcMain.handle("windows:deleteKeyStorage", async (e, key) => {
    return keytar.deletePassword(os.userInfo().username, key)
  })
}
