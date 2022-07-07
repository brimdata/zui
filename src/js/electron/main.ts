import {appPathSetup} from "./appPathSetup"
import userTasks from "./userTasks"
// app path and log setup should happen before other imports.
appPathSetup()

import {app, ipcMain} from "electron"
import log from "electron-log"
import "regenerator-runtime/runtime"
import {setupAutoUpdater} from "./autoUpdater"
import {BrimMain} from "./brim"
import globalStoreMainHandler from "./ipc/globalStore/mainHandler"
import windowsMainHandler from "./ipc/windows/mainHandler"
import secretsMainHandler from "./ipc/secrets/mainHandler"
import electronIsDev from "./isDev"
import menu from "./menu"
import {handleQuit} from "./quitter"

import {handleSquirrelEvent} from "./squirrel"
import {serve} from "src/pkg/electron-ipc-service"
import {paths} from "src/app/ipc/paths"
import {windowsPre25Exists} from "./windows-pre-25"
import {meta} from "src/app/ipc/meta"
import secureWebContents from "./secure-web-contents"
import env from "src/app/core/env"
import path, {join} from "path"
import requireAll from "./require-all"
import isDev from "./isDev"
import fs from "fs-extra"
require("@electron/remote/main").initialize()

const pkg = meta.packageJSON()

export const mainDefaults = () => ({
  lakePort: pkg.lake.port || 9867,
  lakeRoot: join(app.getPath("userData"), "lake"),
  lakeLogs: app.getPath("logs"),
  lake: true,
  devtools: isDev,
  appState: join(app.getPath("userData"), "appState.json"),
  releaseNotes: true,
  autoUpdater: true,
})

export type MainArgs = ReturnType<typeof mainDefaults>

const migrateBrimToZui = () => {
  const zuiDataPath = path.join(app.getPath("userData"), "data")
  const brimDataPath = zuiDataPath.replace("zui", "brim")
  log.info({zuiDataPath, brimDataPath})
}

export async function main(args: Partial<MainArgs> = {}) {
  const opts = {...mainDefaults(), ...args}
  requireAll(join(__dirname, "./initializers"))
  secureWebContents()
  if (handleSquirrelEvent(app)) return
  if (await windowsPre25Exists()) {
    app.quit()
    return
  }
  userTasks(app)

  // TODO: find out why first run isn't working in dev
  // if (await meta.isFirstRun()) await migrateBrimToZui()
  log.info("first run is: " + (await meta.isFirstRun()))
  await migrateBrimToZui()

  const brim = await BrimMain.boot(opts)
  menu.setMenu(brim)

  windowsMainHandler(brim)
  globalStoreMainHandler(brim)
  secretsMainHandler()
  serve(paths)
  serve(meta)
  handleQuit(brim)

  ipcMain.handle("get-feature-flags", () => {
    return app.commandLine.getSwitchValue("feature-flags").split(",")
  })

  ipcMain.handle("get-main-args", () => ({
    ...opts,
  }))

  // autoUpdater should not run in dev, and will fail if the code has not been signed
  if (!electronIsDev && opts.autoUpdater) {
    setupAutoUpdater().catch((err) => {
      log.error("Failed to initiate autoUpdater: " + err)
    })
  }

  const brimCustomProtocol = "brim"
  app.setAsDefaultProtocolClient(brimCustomProtocol)
  app.on("second-instance", (e, argv) => {
    for (let arg of argv) {
      // handle custom protocol url handling for windows here
      if (arg.startsWith(`${brimCustomProtocol}://`)) return brim.openUrl(arg)

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
  app.on("activate", () => brim.activate())
  app.on("open-url", (event, url) => {
    // recommended to preventDefault in docs: https://www.electronjs.org/docs/api/app#event-open-url-macos
    event.preventDefault()
    log.info("Opening url:", url)
    brim.openUrl(url)
  })

  app.whenReady().then(() => brim.start())
  return brim
}

app.disableHardwareAcceleration()
const gotTheLock = app.requestSingleInstanceLock()
if (gotTheLock) {
  main().then(() => {
    if (env.isIntegrationTest) require("./itest")
  })
} else {
  app.quit()
}

process.on("unhandledRejection", (e) => {
  log.error(e)
})
