/* @flow */
// $FlowFixMe
import "regenerator-runtime/runtime"

import {BrowserWindow, app, ipcMain} from "electron"
import path from "path"

import {handleSquirrelEvent} from "./squirrel"
import {installExtensions} from "./extensions"
import browserWindow from "./browserWindow"
import windowState from "./windowState"
import {ZQD} from "../zqd/zqd"
import {IngestProcess} from "../zqd/ingest"

// XXX this should be configureable via build settings
const dataRoot = "./data"
const spaceDir = path.join(dataRoot, "spaces")

async function main() {
  // Disable Warnings in the Console
  delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true"

  if (handleSquirrelEvent(app)) return

  let winState = windowState()
  let win = browserWindow(winState)
  let zqd
  let welcome

  app.on("ready", () => {
    installExtensions()
    winState.load()
    // win.create()
    welcome = new BrowserWindow({
      titleBarStyle: "hidden",
      resizable: false,
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

  ipcMain.handle("redirect:search", (e, space) => {
    BrowserWindow.fromWebContents(e.sender).close()
    if (!win.exists())
      win.create({
        space,
        id: "zqd",
        host: "localhost",
        port: "9867",
        username: "",
        password: ""
      })
    win.switchTo("search")
  })

  ipcMain.on("open-search-window", () => {
    if (!win.exists()) win.create()
    win.switchTo("search")
  })

  ipcMain.on("open-login-window", () => {
    win.switchTo("login")
  })

  ipcMain.on("close-window", () => {
    let win = BrowserWindow.getFocusedWindow()
    if (win) win.close()
  })

  ipcMain.handle("zqd:info", () => {
    if (!zqd) {
      zqd = new ZQD(spaceDir)
      zqd.start()
    }
    const addr = zqd.addr()
    return Promise.resolve({addr})
  })

  ipcMain.on("pcaps:ingest", (event, arg) => {
    let proc = new IngestProcess(spaceDir, arg.paths)
    proc.on("space_updated", (payload) => {
      event.reply("pcaps:update", payload)
    })
    proc.start()
    event.reply("pcaps:update", "hoal")
  })

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
  })
}

main()
