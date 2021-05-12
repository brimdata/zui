import {app, dialog} from "electron"
import fs from "fs-extra"
import os from "os"
import {join} from "path"

const VAR = "LocalAppData"

function getDir() {
  if (VAR in process.env) {
    const dir = process.env[VAR]
    return join(dir, "Brim")
  } else {
    return join(app.getPath("home"), "AppData", "Local", "Brim")
  }
}

function getExe() {
  return join(getDir(), "Brim.exe")
}

export function windowsPre25Exists() {
  if (os.platform() !== "win32") return false

  const dir = getDir()
  const exe = getExe()
  if (!fs.existsSync(exe)) return false

  dialog.showErrorBox(
    "Previous Brim Version Detected",
    `Please uninstall it before before launching the new version.\n\n${dir}`
  )
  return true
}
