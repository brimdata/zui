/* @flow */

// $FlowFixMe
import createGlobalStore from "../state/createGlobalStore"
import globalStoreMainHandler from "./ipc/globalStore/mainHandler"
import windowsMainHandler from "./ipc/windows/mainHandler"
import zqdMainHandler from "./ipc/zqd/mainHandler"

console.time("init")
import "regenerator-runtime/runtime"

import {app} from "electron"

import fixPath from "fix-path"

// inherit shell PATH environment to access zeek, zq, and mergecap binaries.
fixPath()

import {handleSquirrelEvent} from "./squirrel"
import {installExtensions} from "./extensions"
import tron from "./tron"

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

  zqdMainHandler()
  windowsMainHandler(winMan)
  globalStoreMainHandler(store)

  app.on("ready", () => {
    installExtensions()
    winMan.init(sessionState)
  })

  app.on("before-quit", () => {
    winMan.isQuitting()
  })

  app.on("quit", () => {
    session.save(winMan.getWindows(), store.getState())
  })

  app.on("activate", () => {
    if (!winMan.count() === 0) winMan.init()
  })

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
  })
}

main()
