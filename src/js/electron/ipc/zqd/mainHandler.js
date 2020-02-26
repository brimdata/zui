/* @flow */
import {ipcMain, app} from "electron"
import path from "path"

import {IngestProcess} from "../../../zqd/ingest"
import {ZQD} from "../../../zqd/zqd"
import type {ZqdIngestMsg} from "../types"

const appRoot = app.getPath("appData")
const dataRoot = "data"
const spaceDir = path.join(appRoot, dataRoot, "spaces")

export default function zqdMainHandler() {
  let zqd = null
  let proc = null
  if (!zqd) {
    zqd = new ZQD(spaceDir)
    zqd.start()
    console.log("zqd started on: ", zqd.addr())
  }

  ipcMain.handle("zqd:info", () => {
    if (zqd) {
      let addr = zqd.addr()
      return {addr}
    } else {
      throw new Error("ZQD not yet started")
    }
  })

  ipcMain.handle("zqd:ingest", (e, {paths}: ZqdIngestMsg) => {
    proc = new IngestProcess(spaceDir, paths)
    let space = proc.start()
    proc.on("space_updated", ({done}) => {
      console.log("zqd:ingest:update", {space, done})
      if (done) proc = null
    })

    console.log("zqd:ingest", {space, paths})
    return space
  })

  ipcMain.handle("zqd:subscribe", (e) => {
    return new Promise((resolve) => {
      if (proc) {
        proc.on("space_updated", (args) => {
          e.sender.send("zqd:ingest_update", args)
          if (args.done) resolve()
        })
      } else {
        resolve()
      }
    })
  })
}
