/* @flow */

// $FlowFixMe
import createGlobalStore from "../state/createGlobalStore"
import globalStoreMainHandler from "./ipc/globalStore/mainHandler"
import windowsMainHandler from "./ipc/windows/mainHandler"
import zqdMainHandler from "./ipc/zqd/mainHandler"

console.time("init")
import "regenerator-runtime/runtime"

import {app} from "electron"

import {handleSquirrelEvent} from "./squirrel"
import {installExtensions} from "./extensions"
import tron from "./tron"
import path from "path"
import {ZQD} from "../zqd/zqd"

async function main() {
  // Disable Warnings in the Console
  delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true"

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

  app.setAboutPanelOptions({
    applicationName: app.getName(),
    applicationVersion: app.getVersion(),
    // copyright: "",
    // version: "",
    website: "https://www.brimsecurity.com",
    iconPath: "dist/static/AppIcon.icns"
  })
  // options Object
  // applicationName String (optional) - The app's name.
  // applicationVersion String (optional) - The app's version.
  // copyright String (optional) - Copyright information.
  //   version String (optional) macOS - The app's build version number.
  // credits String (optional) macOS Windows - Credit information.
  //   authors String Linux - List of app authors.
  //   website String (optional) Linux - The app's website.
  // iconPath String (optional) Linux Windows - Path to the app's icon. On Linux, will be shown as 64x64 pixels while retaining aspect ratio.

  app.on("ready", () => {
    installExtensions()
    winMan.init(sessionState)
  })

  app.on("before-quit", () => {
    winMan.isQuitting()
  })

  app.on("quit", () => {
    session.save(winMan.getWindows(), store.getState())
    zqd.close()
  })

  app.on("activate", () => {
    if (!winMan.count() === 0) winMan.init()
  })

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
  })
}

main()
