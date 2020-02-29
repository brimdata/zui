/* @flow */

// $FlowFixMe
console.time("init")
import "regenerator-runtime/runtime"

import {app} from "electron"

import fixPath from "fix-path"

// inherit shell PATH environment to access zeek, zq, and mergecap binaries.
fixPath()

import {handleSquirrelEvent} from "./squirrel"
import {installExtensions} from "./extensions"
import setupMainHandlers from "./ipc/setupMainHandlers"
import tron from "./tron"

async function main() {
  // Disable Warnings in the Console
  delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true"

  if (handleSquirrelEvent(app)) return

  let winMan = tron.windowManager()
  let session = tron.session()

  setupMainHandlers(winMan)

  app.on("ready", () => {
    installExtensions()
    winMan.init(session.load())
  })

  app.on("before-quit", () => {
    winMan.isQuitting()
  })

  app.on("quit", () => {
    session.save(winMan.getWindows())
  })

  app.on("activate", () => {
    if (!winMan.count() === 0) winMan.init()
  })

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
  })
}

main()
