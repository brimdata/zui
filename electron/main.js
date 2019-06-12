/* @noflow */

// Disable Warnings in the Console
delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true"

const {app, BrowserWindow} = require("electron")
const {installExtensions} = require("./extensions")
const path = require("path")
const os = require("os")

let win

const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 1200,
    backgroundColor: "#ffffff",
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
