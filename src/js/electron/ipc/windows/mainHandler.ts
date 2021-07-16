import log from "electron-log"
import {BrowserWindow, dialog, ipcMain} from "electron"
import {BrimMain} from "../../brim"

let started = false

// Convert this file to the new ipc model
export default function(brim: BrimMain) {
  ipcMain.handle("windows:initialState", (_e, {id}) => {
    const window = brim.windows.getWindow(id)
    if (!window) return undefined
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

  ipcMain.on("windows:updateState", (e, id, state) => {
    brim.windows.getWindow(id).initialState = state
  })
}
