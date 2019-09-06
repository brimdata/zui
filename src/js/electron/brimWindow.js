/* @flow */
import {BrowserWindow, ipcMain} from "electron"

import {setAppMenu} from "./setAppMenu"

let loginSize = [630, 460]

export default function brimWindow() {
  let win = null
  let size = [1000, 800]
  let firstVisit = true

  return {
    exists() {
      return win != null
    },

    destroy() {
      win = null
    },

    create() {
      win = new BrowserWindow({
        titleBarStyle: "hidden",
        width: loginSize[0],
        height: loginSize[1],
        webPreferences: {
          experimentalFeatures: true,
          nodeIntegration: true
        }
      })
      win.center()
      win.setMenu(null)
      win.on("closed", this.destroy)
      ipcMain.on("page:login:mount", this.makeLogin)
      ipcMain.on("page:search:mount", this.makeSearch)
      ipcMain.on("page:search:unmount", this.saveDimens)
      win.loadFile("index.html")
    },

    saveDimens() {
      if (win) {
        size = win.getSize()
        firstVisit = false
      }
    },

    makeLogin() {
      if (win) {
        win.setSize(...loginSize)
        win.setResizable(false)
        setAppMenu("LOGIN", win)
      }
    },

    makeSearch() {
      if (win) {
        win.setSize(...size)
        if (firstVisit) win.center()
        win.setResizable(true)
        setAppMenu("SEARCH", win)
      }
    }
  }
}
