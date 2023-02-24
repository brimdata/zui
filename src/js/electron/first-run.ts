import fs from "fs-extra"
import path from "path"
import log from "electron-log"
import {app} from "electron"

export const getPath = () => path.join(app.getPath("userData"), "first-run")

export function isFirstRun() {
  return new Promise<boolean>((res) => {
    fs.stat(getPath(), (err) => {
      if (err) {
        fs.createFile(getPath()).catch((e) => log.error(e))
        res(true)
      } else {
        res(false)
      }
    })
  })
}
