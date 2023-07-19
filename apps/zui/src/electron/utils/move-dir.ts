import fs from "fs-extra"
import {debug, error} from "electron-log"

export function moveDir(oldDir: string, newDir: string) {
  debug("migrating directory " + oldDir + " to " + newDir)
  if (!fs.existsSync(oldDir)) {
    debug("skipping migration: oldDir does not exist " + oldDir)
    return
  }
  if (fs.existsSync(newDir) && fs.readdirSync(newDir).length > 0) {
    debug("skipping migration: newDir already exists with content " + newDir)
    return
  }

  try {
    fs.copySync(oldDir, newDir)
  } catch (e) {
    error("error migrating folder:", e)
    fs.removeSync(newDir)
  }
  fs.removeSync(oldDir)
  debug("migration success")
}
