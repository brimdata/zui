import {app, dialog} from "electron"
import {join} from "path"
import fs from "fs-extra"

function oldVersionPath() {
  return join(app.getPath("appData"), "Local", "Brim")
}

export function windowsPre25Exists() {
  const dir = oldVersionPath()

  if (fs.existsSync(dir)) {
    dialog.showErrorBox(
      "Previous Brim Version Detected",
      `Please uninstall it before before launching the new version.\n\n${dir}`
    )
    return true
  }
  return false
}
