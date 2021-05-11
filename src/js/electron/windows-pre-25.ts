import {app, dialog} from "electron"
import {join} from "path"
import fs from "fs-extra"
import os from "os"

const VAR = "LocalAppData"

function oldVersionPath() {
  if (VAR in process.env) {
    const dir = process.env[VAR]
    return join(dir, "Brim")
  } else {
    return join(app.getPath("home"), "AppData", "Local", "Brim")
  }
}

export function windowsPre25Exists() {
  if (os.platform() !== "win32") return false

  const dir = oldVersionPath()
  if (!fs.existsSync(dir)) return false

  dialog.showErrorBox(
    "Previous Brim Version Detected",
    `Please uninstall it before before launching the new version.\n\n${dir}`
  )
  return true
}
