/* @flow */
// $FlowFixMe
import "regenerator-runtime/runtime"

import {app, ipcMain} from "electron"

import {handleSquirrelEvent} from "./squirrel"
import {installExtensions} from "./extensions"
import lib from "../lib"
import windowState from "./windowState"

async function main() {
  // Disable Warnings in the Console
  delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true"

  if (handleSquirrelEvent(app)) return

  let winState = windowState()
  let win = lib.window(winState)

  app.on("ready", () => {
    installExtensions()
    winState.load()
    win.create()
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

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
  })
}

main()
