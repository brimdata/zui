import {nanoid} from "@reduxjs/toolkit"
import {BrowserWindow, ipcMain, Menu} from "electron"
import {join} from "path"

const makeChannel = (name) => (id) => [`__html-dialog__`, id, name].join(":")
export const readyChannel = makeChannel("ready")
export const closeChannel = makeChannel("close")

class HTMLDialog {
  showErrorBox(title: string, content: string) {
    const id = nanoid()
    let win: BrowserWindow
    return new Promise<void>((resolve) => {
      win = new BrowserWindow({
        width: 500,
        height: 300,
        resizable: false,
        useContentSize: true,
        minimizable: false,
        maximizable: false,
        modal: true,
        show: false,
        backgroundColor: "#F5F5F5",
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      })
      // This will remove the menu bar on windows and linux from the top of the window.
      Menu.setApplicationMenu(null)

      win.loadFile(join(__dirname, "dialog.html"), {
        query: {title, content, id}
      })

      ipcMain.once(closeChannel(id), () => {
        win.close()
      })

      ipcMain.once(readyChannel(id), (e, height) => {
        win.setContentSize(500, height)
        win.show()
      })

      win.on("close", () => resolve())
    })
  }
}

export default new HTMLDialog()
