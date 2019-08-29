/* @noflow */

import {app, BrowserWindow} from "electron"

import {handleSquirrelEvent} from "./squirrel"
import {installExtensions} from "./extensions"

function main() {
  // Disable Warnings in the Console
  delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true"

  if (handleSquirrelEvent(app)) return

  let win

  const createWindow = () => {
    win = new BrowserWindow({
      width: 630,
      height: 460,
      titleBarStyle: "hidden",
      webPreferences: {
        experimentalFeatures: true,
        nodeIntegration: true
      }
    })
    win.loadFile("index.html")
    win.setMenu(null)
    win.on("closed", () => {
      win = null
    })
  }

  app.on("ready", () => {
    installExtensions()
    createWindow()
  })

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit()
    }
  })

  app.on("activate", () => {
    if (win === null) {
      createWindow()
    }
  })
}

main()
