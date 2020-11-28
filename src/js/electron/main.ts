import {appPathSetup} from "./appPathSetup"
import Prefs from "../state/Prefs"
import userTasks from "./userTasks"

// app path and log setup should happen before other imports.
appPathSetup()

import createGlobalStore from "../state/createGlobalStore"
import globalStoreMainHandler from "./ipc/globalStore/mainHandler"
import menu from "./menu"
import windowsMainHandler from "./ipc/windows/mainHandler"
import zqdMainHandler from "./ipc/zqd/mainHandler"

console.time("init")
import "regenerator-runtime/runtime"

import {app} from "electron"

import {handleSquirrelEvent} from "./squirrel"
import tron from "./tron"
import path from "path"
import {ZQD} from "../zqd/zqd"
import electronIsDev from "./isDev"
import {setupAutoUpdater} from "./autoUpdater"
import log from "electron-log"
import {handleQuit} from "./quitter"
import {Brim} from "./brim"

async function main() {
  if (handleSquirrelEvent(app)) return
  userTasks(app)
  const session = tron.session()
  const data = await session.load()
  const brim = new Brim(data)
  const winMan = brim.windows
  const store = createGlobalStore(data ? data.globalState : undefined)
  const spaceDir = path.join(app.getPath("userData"), "data", "spaces")
  const suricataRunner = Prefs.getSuricataRunner(store.getState())
  const suricataUpdater = Prefs.getSuricataUpdater(store.getState())
  const zeekRunner = Prefs.getZeekRunner(store.getState())
  const zqd = new ZQD(spaceDir, suricataRunner, suricataUpdater, zeekRunner)

  menu.setMenu(winMan, store, session)
  zqdMainHandler(zqd)
  windowsMainHandler(winMan)
  globalStoreMainHandler(store, winMan)
  handleQuit(winMan, store, session, zqd)

  // autoUpdater should not run in dev, and will fail if the code has not been signed
  if (!electronIsDev) {
    try {
      await setupAutoUpdater()
    } catch (err) {
      log.error("Failed to initiate autoUpdater: " + err)
    }
  }

  app.on("second-instance", (e, argv) => {
    for (let arg of argv) {
      switch (arg) {
        case "--new-window":
          winMan.openWindow("search")
          break
        case "--move-to-current-display":
          winMan.moveToCurrentDisplay()
          break
      }
    }
  })

  app.whenReady().then(() => brim.start())
  app.on("activate", () => brim.activate())

  app.on("web-contents-created", (event, contents) => {
    contents.on("will-attach-webview", (e) => {
      e.preventDefault()
      log.error("Security Warning: Prevented creation of webview")
    })

    contents.on("will-navigate", (e, url) => {
      if (contents.getURL() === url) return // Allow reloads
      e.preventDefault()
      log.error(`Security Warning: Prevented navigation to ${url}`)
    })

    contents.on("new-window", (e) => {
      e.preventDefault()
      log.error("Security Warning: Prevented new window from renderer")
    })
  })
}

app.disableHardwareAcceleration()
const gotTheLock = app.requestSingleInstanceLock()
if (gotTheLock) {
  main().then(() => {
    if (process.env.BRIM_ITEST === "true") require("./itest")
  })
} else {
  app.quit()
}
