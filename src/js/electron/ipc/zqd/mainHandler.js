/* @flow */
import {ipcMain, app} from "electron"
import path from "path"
import electronIsDev from "../../isDev"
import {ZQD} from "../../../zqd/zqd"

function appRoot() {
  if (electronIsDev) {
    return app.getAppPath()
  } else {
    return app.getPath("userData")
  }
}

const spaceDir = path.join(appRoot(), "data", "spaces")

export default function zqdMainHandler() {
  let zqd = null
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

  ipcMain.handle("zqd:subscribe", () => {})
}
