import {appPathSetup} from "./appPathSetup"
import userTasks from "./userTasks"
import workspace from "../brim/workspace"

// app path and log setup should happen before other imports.
appPathSetup()

import globalStoreMainHandler from "./ipc/globalStore/mainHandler"
import menu from "./menu"
import windowsMainHandler from "./ipc/windows/mainHandler"

console.time("init")
import "regenerator-runtime/runtime"

import {app} from "electron"

import {handleSquirrelEvent} from "./squirrel"
import electronIsDev from "./isDev"
import {setupAutoUpdater} from "./autoUpdater"
import log from "electron-log"
import {handleQuit} from "./quitter"
import {Brim} from "./brim"
import {Authenticator} from "../auth"
import url from "url"
import Workspaces from "../state/Workspaces"

async function main() {
  if (handleSquirrelEvent(app)) return
  userTasks(app)
  const brim = await Brim.boot()
  menu.setMenu(brim)
  windowsMainHandler(brim)
  globalStoreMainHandler(brim)
  handleQuit(brim)

  // autoUpdater should not run in dev, and will fail if the code has not been signed
  if (!electronIsDev) {
    setupAutoUpdater().catch((err) => {
      log.error("Failed to initiate autoUpdater: " + err)
    })
  }

  app.on("second-instance", (e, argv) => {
    for (let arg of argv) {
      switch (arg) {
        case "--new-window":
          brim.windows.openWindow("search")
          break
        case "--move-to-current-display":
          brim.windows.moveToCurrentDisplay()
          break
      }
    }
  })

  app.whenReady().then(() => brim.start())
  app.on("activate", () => brim.activate())

  app.setAsDefaultProtocolClient("brim")
  app.on("open-url", (event, cbUrl) => {
    event.preventDefault()

    const urlParts = url.parse(cbUrl, true)
    const workspaceId = urlParts?.query?.state
    const ws = Workspaces.id(workspaceId as string)(brim.store.getState())
    console.log("ws is: ", ws)
    const authenticator = new Authenticator(
      workspace(ws).getAddress(),
      ws.auth.clientId,
      ws.auth.domain
    )
    authenticator
      .loadTokens(cbUrl)
      .then((token) => {
        brim.store.dispatch(Workspaces.setWorkspaceToken(ws.id, token))
        brim.activate()
      })
      .catch((e) => log.error("error loading tokens: ", e))
  })

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
