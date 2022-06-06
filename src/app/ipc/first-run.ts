import fs from "fs-extra"
import path from "path"
import log from "electron-log"
import {app} from "electron"

export const getPath = () => path.join(app.getPath("userData"), "first-run")

let firstRun = undefined

export function isFirstRun() {
  return new Promise<boolean>((res) => {
    if (firstRun !== undefined) return res(firstRun)
    fs.stat(getPath(), (err) => {
      if (err) {
        fs.createFile(getPath()).catch((e) => log.error(e))
        res((firstRun = true))
      } else {
        res((firstRun = false))
      }
    })
  })
}
