/* @flow */

// Path and log setup needs to happen first
import {app} from "electron"
import log from "electron-log"
import electronIsDev from "./isDev"
import path from "path"

// setupPaths must be called very early in startup, before the app 'ready'
// event fires, to ensure any Electron state is recorded to the intended
// locations.
function setupPaths() {
  if (electronIsDev) {
    // isDev is true for general dev execution and integration tests.
    if (process.env.BRIM_ITEST != "true") {
      // For general developer execution, put state and logs under a
      // "run" directory in the git directory.
      app.setPath("userData", path.join(app.getAppPath(), "run"))
    }
    // We don't override for integration tests as they set userData
    // via the user-data-dir chromeDriver command line argument,
    // so don't override it.
  }
  // We don't have cross-user state sharing, so use userData for appData.
  app.setPath("appData", path.join(app.getPath("userData"), "appData"))
  // Logs go under userData, to make finding logs consisten across platforms.
  app.setPath("logs", path.join(app.getPath("userData"), "logs"))

  log.transports.file.resolvePath = (variables) => {
    return path.join(app.getPath("logs"), variables.fileName)
  }

  log.info(
    "app paths: getAppPath",
    app.getAppPath(),
    "appData",
    app.getPath("appData"),
    "userData",
    app.getPath("userData"),
    "logs",
    app.getPath("logs")
  )
}

setupPaths()

// $FlowFixMe
import createGlobalStore from "../state/createGlobalStore"
import globalStoreMainHandler from "./ipc/globalStore/mainHandler"
import menu from "./menu"
import windowsMainHandler from "./ipc/windows/mainHandler"
import zqdMainHandler from "./ipc/zqd/mainHandler"

console.time("init")
import "regenerator-runtime/runtime"

import {handleSquirrelEvent} from "./squirrel"
import {installExtensions} from "./extensions"
import tron from "./tron"
import {ZQD} from "../zqd/zqd"
import {setupAutoUpdater} from "./autoUpdater"

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

  menu.setMenu(winMan)
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
    session.save(winMan.getState(), store.getState())
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
