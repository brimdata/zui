import fs from "fs-extra"
import path from "path"
import {app} from "electron"

let result: undefined | boolean = undefined

export function setFirstRun(value: boolean) {
  result = value
}

export function isFirstRun() {
  if (result === undefined) {
    if (markerExists()) {
      setFirstRun(false)
    } else {
      setFirstRun(true)
      markFirstRun()
    }
  }

  return result
}

function markFirstRun() {
  fs.createFileSync(getPath())
}

function markerExists() {
  return fs.existsSync(getPath())
}

function getPath() {
  return path.join(app.getPath("userData"), "first-run")
}
