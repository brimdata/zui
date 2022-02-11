import env from "app/core/env"
import {app} from "electron"
import path from "path"

function getDirectory() {
  const root = app.getAppPath().replace("app.asar", "app.asar.unpacked")
  return path.join(root, "zdeps")
}

function getBin(name) {
  if (env.isWindows) name += ".exe"
  return path.join(getDirectory(), name)
}

export const zed = getBin("zed")
