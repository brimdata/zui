/* @flow */
// $FlowFixMe
import "regenerator-runtime/runtime"

import {BrowserWindow, app, ipcMain} from "electron"

import {handleSquirrelEvent} from "./squirrel"
import {installExtensions} from "./extensions"
import browserWindow from "./browserWindow"
import windowState from "./windowState"

async function main() {
  // Disable Warnings in the Console
  delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true"

  if (handleSquirrelEvent(app)) return

  let winState = windowState()
  let win = browserWindow(winState)
  let welcome

  app.on("ready", () => {
    installExtensions()
    winState.load()
    // win.create()
    welcome = new BrowserWindow({
      titleBarStyle: "hidden",
      width: 600,
      height: 400,
      webPreferences: {
        nodeIntegration: true
      }
    })
    welcome.loadFile("welcome.html")
  })

  app.on("activate", () => {
    if (!win.exists()) win.create()
  })

  ipcMain.on("open-search-window", () => {
    win.switchTo("search")
  })

  ipcMain.on("open-login-window", () => {
    win.switchTo("login")
  })

  ipcMain.on("close-window", () => {
    let win = BrowserWindow.getFocusedWindow()
    if (win) win.close()
  })

  ipcMain.handle("pcaps:ingest", (event, args) => {
    console.log("RECEIVED", args)
    return "DONE"
  })

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
  })
}

main()
