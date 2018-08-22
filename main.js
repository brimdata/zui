const {app, BrowserWindow, dialog, autoUpdater, Menu} = require("electron")
const menu = require("./menu")
const server = "http://desktop-release.looky.cloud"
const feed = `${server}/update/${process.platform}/${app.getVersion()}`
autoUpdater.setFeedURL(feed)
let win

const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 1200,
    backgroundColor: "#ffffff",
    titleBarStyle: "hidden"
  })
  win.loadFile("index.html")
  win.setMenu(null)
  win.on("closed", () => {
    win = null
  })
}

app.on("ready", () => {
  createWindow()
  autoUpdater.checkForUpdates()
  Menu.setApplicationMenu(menu)
  // setInterval(() => {
  //   autoUpdater.checkForUpdates()
  // }, 15 * 1000)
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

autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Restart", "Later"],
    title: "Application Update",
    message: process.platform === "win32" ? releaseNotes : releaseName,
    detail:
      "A new version has been downloaded. Restart the application to apply the updates."
  }

  dialog.showMessageBox(dialogOpts, response => {
    if (response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on("error", message => {
  console.error("Pblem updating the app:", message)
})

autoUpdater.on("update-available", () => {
  console.log("update available")
})

autoUpdater.on("update-not-available", () => {
  console.log("Up to date!")
})

autoUpdater.on("checking-for-update", () => {
  console.log("checking for update")
})
