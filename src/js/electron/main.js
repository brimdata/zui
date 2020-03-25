/* @flow */

// $FlowFixMe
import createGlobalStore from "../state/createGlobalStore"
import globalStoreMainHandler from "./ipc/globalStore/mainHandler"
import windowsMainHandler from "./ipc/windows/mainHandler"
import zqdMainHandler from "./ipc/zqd/mainHandler"

console.time("init")
import "regenerator-runtime/runtime"

import {app, autoUpdater, dialog} from "electron"

import {handleSquirrelEvent} from "./squirrel"
import {installExtensions} from "./extensions"
import tron from "./tron"
import path from "path"
import {ZQD} from "../zqd/zqd"
import electronIsDev from "./isDev"

function setupAutoUpdater() {
  const feedURL = path.join(
    "https://update.electronjs.org/brimsec/brim",
    process.platform,
    app.getVersion()
  )
  autoUpdater.setFeedURL(feedURL)

  autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: "info",
      buttons: ["Restart", "Later"],
      title: "Application Update",
      // releaseNotes are not available for windows, so use name instead
      message: process.platform === "win32" ? releaseNotes : releaseName,
      detail:
        "A new version of Brim has been downloaded. Restart the application to apply the update."
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.on("error", (err) => {
    console.error("There was a problem updating the application: " + err)
  })

  // check for updates immediately on startup
  autoUpdater.checkForUpdates()

  // then check for updates every 10 minutes
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 10 * 60 * 1000)
}

async function main() {
  if (handleSquirrelEvent(app)) return
  let session = tron.session()
  let winMan = tron.windowManager()

  let sessionState = session.load()
  let store = createGlobalStore(
    sessionState ? sessionState.globalState : undefined
  )

  const spaceDir = path.join(app.getPath("userData"), "data", "spaces")
  const zqd = new ZQD(spaceDir)

  zqdMainHandler(zqd)
  windowsMainHandler(winMan)
  globalStoreMainHandler(store, winMan)

  // autoUpdater should not run in dev, and will fail if the code has not been signed
  if (!electronIsDev) {
    try {
      setupAutoUpdater()
    } catch (err) {
      console.error("Failed to initiate autoUpdater: " + err)
    }
  }

  app.on("ready", () => {
    installExtensions()
    winMan.init(sessionState)
  })

  app.on("before-quit", () => {
    winMan.isQuitting(true)
  })

  app.on("quit", () => {
    session.save(winMan.getWindows(), store.getState())
    zqd.close()
  })

  app.on("activate", () => {
    if (!winMan.count() === 0) winMan.init()
  })

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin" || winMan.isQuitting()) app.quit()
  })

  app.on("web-contents-created", (event, contents) => {
    contents.on("will-attach-webview", (e) => {
      e.preventDefault()
      console.error("Security Warning: Prevented creation of webview")
    })

    contents.on("will-navigate", (e, url) => {
      if (contents.getURL() === url) return // Allow reloads
      e.preventDefault()
      console.error(`Security Warning: Prevented navigation to ${url}`)
    })

    contents.on("new-window", (e) => {
      e.preventDefault()
      console.error("Security Warning: Prevented new window from renderer")
    })
  })
}

main()
