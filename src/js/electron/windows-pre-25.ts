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

/**
 * Is there a duplicate, older version of Brim on the windows system?
 * In version 25, we switched our installer. Previous versions placed
 * the Brim.exe file in /%LocalAppData%/Brim/Brim.exe. It now places
 * it in /%LocalAppData%/Programs/Brim/Brim.exe.
 *
 * If the old version exists, we inform the user to uninstall it first,
 * then launch the new one.
 * @returns boolean
 */
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
