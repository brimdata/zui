/* @flow */
import {ipcMain} from "electron"
import type {$ZQD} from "../../../zqd/zqd"

export default function zqdMainHandler(zqd: $ZQD) {
  if (zqd) {
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

  ipcMain.handle("zqd:subscribe", () => {})
}
