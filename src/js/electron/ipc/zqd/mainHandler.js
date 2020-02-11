/* @flow */
import {ipcMain} from "electron"
import path from "path"

import {IngestProcess} from "../../../zqd/ingest"
import {ZQD} from "../../../zqd/zqd"
import type {ZqdIngestMsg} from "../types"
import ipc from ".."

const dataRoot = "./data"
const spaceDir = path.join(dataRoot, "spaces")

export default function zqdMainHandler() {
  let zqd = null
  let proc = null

  ipcMain.handle("zqd:info", () => {
    if (!zqd) {
      zqd = new ZQD(spaceDir)
      zqd.start()
    }
    return {addr: zqd.addr()}
  })

  ipcMain.handle("zqd:ingest", (e, {paths}: ZqdIngestMsg) => {
    proc = new IngestProcess(spaceDir, paths)
    proc.on("space_updated", ({done}) => done && (proc = null))
    return proc.start()
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
