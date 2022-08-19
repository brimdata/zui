import {BrowserWindow, dialog, ipcMain} from "electron"
import log from "electron-log"
import {BrimMain} from "../../brim"

// Convert this file to the new ipc model
export default function (brim: BrimMain) {
  ipcMain.handle("windows:initialState", (_e, {id}) => {
    const window = brim.windows.getWindow(id)
    if (!window) return undefined
    return window.state
  })

  ipcMain.handle("windows:newSearchTab", async (e, params) => {
    await brim.windows.openSearchTab(params.params)
  })

  ipcMain.handle("windows:log", (e, {id, args}) => {
    log.info(`[${id}]: `, ...args)
  })

  ipcMain.handle("windows:openDirectorySelect", async (e) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    return await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
    })
  })

  ipcMain.handle("windows:showSaveDialog", async (e, args) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    return dialog.showSaveDialog(win, args)
  })

  ipcMain.on("windows:updateState", (e, id, state) => {
    brim.windows.setWindowState(id, state)
  })
}
