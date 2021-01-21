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
import {globalDispatch} from "../state/GlobalContext"
import WorkspaceStatuses from "../state/WorkspaceStatuses"
import sendTo from "./ipc/sendTo"
import ipc from "./ipc"

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
    // TODO: Mason - refactor this to behave more like a router (i.e. handle by path)
    // TODO: Mason - this is a macOS only event :( investigate more here https://discuss.atom.io/t/how-to-open-application-from-a-url-on-both-macos-and-windows/61004
    // recommended to preventDefault by docs: https://www.electronjs.org/docs/api/app#event-open-url-macos
    event.preventDefault()

    const urlParts = url.parse(cbUrl, true)
    // TODO: Mason - protect this parsing more
    const stateItems = (urlParts.query.state as string).split(",")
    const workspaceId = stateItems[0]
    const windowId = stateItems[1]
    const ws = Workspaces.id(workspaceId as string)(brim.store.getState())
    const authenticator = new Authenticator(
      ws.id,
      ws.authData.clientId,
      ws.authData.domain
    )
    authenticator
      .loadTokens(cbUrl)
      .then((token) => {
        const win = brim.windows.getWindow(windowId)
        sendTo(
          win.ref.webContents,
          ipc.windows.authCallback(workspaceId, token)
        )
      })
      .catch((e) => {
        log.error("error loading tokens: ", e)
      })
      .finally(() => {
        brim.activate()
      })
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
