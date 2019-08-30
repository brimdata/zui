/* @flow */
import {BrowserWindow, ipcMain} from "electron"

import {setAppMenu} from "./setAppMenu"

export default function brimWindow() {
  let win = null
  let lastSize = [1000, 800]

  return {
    exists() {
      win != null
    },

    destroy() {
      win = null
    },

    create() {
      win = new BrowserWindow({
        width: lastSize[0],
        height: lastSize[1],
        titleBarStyle: "hidden",
        webPreferences: {
          experimentalFeatures: true,
          nodeIntegration: true
        }
      })
      win.setMenu(null)
      win.on("closed", this.destroy)
      ipcMain.on("page:login", this.makeLogin)
      ipcMain.on("page:search", this.makeSearch)
      win.loadFile("index.html")
    },

    makeLogin() {
      if (win) {
        lastSize = win.getSize()
        win.setSize(630, 460)
        win.setResizable(false)
        setAppMenu("LOGIN", win)
      }
    },

    makeSearch() {
      if (win) {
        win.setSize(...lastSize)
        win.setResizable(true)
        setAppMenu("SEARCH", win)
      }
    }
  }
}
