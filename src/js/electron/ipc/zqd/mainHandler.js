/* @flow */
import {ipcMain} from "electron"
import path from "path"

import {IngestProcess} from "../../../zqd/ingest"
import {ZQD} from "../../../zqd/zqd"
import type {ZqdIngestMsg} from "../types"

const dataRoot = "./data"
const spaceDir = path.join(dataRoot, "spaces")

export default function zqdMainHandler() {
  let zqd = null

  ipcMain.handle("zqd:info", () => {
    if (!zqd) {
      zqd = new ZQD(spaceDir)
      zqd.start()
    }
    return {addr: zqd.addr()}
  })

  ipcMain.handle("zqd:ingest", (e, {paths}: ZqdIngestMsg) => {
    let update = (payload) => e.sender.send("pcaps:update", payload)
    let proc = new IngestProcess(spaceDir, paths)
    proc.on("space_updated", update)
    let space = proc.start()
    console.log("SPACE", space)
    return space
  })
}
