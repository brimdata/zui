/* @flow */
// $FlowFixMe
import lib from "../lib"

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
import path from "path"

let file = path.join(app.getPath("userData"), "appState.json")

async function main() {
  // Disable Warnings in the Console
  delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true"

  if (handleSquirrelEvent(app)) return

  let winMan = tron.windowManager()
  setupMainHandlers(winMan)

  app.on("ready", () => {
    installExtensions()
    let appState = loadAppState()
    winMan.init(appState)
    // Read the appState.json and create the windows from it.
  })

  app.on("before-quit", () => {
    console.log("BEFORE QUIT")
    winMan.isQuitting()
  })

  app.on("quit", () => {
    let appState = winMan.getState()
    lib
      .file(file)
      .write(JSON.stringify(appState))
      .then(() => {
        console.log("WROTE TO FILE")
      })
  })

  app.on("activate", () => {
    // if (!win.exists()) win.create()
  })

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
  })
}

function loadAppState() {
  let contents = lib.file(file).readSync()
  try {
    return JSON.parse(contents)
  } catch (e) {
    console.error("Unable to load appState.json")
    console.error(e)
    return undefined
  }
}

main()
