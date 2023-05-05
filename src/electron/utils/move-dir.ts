import fs from "fs-extra"
import {debug, error} from "electron-log"

export function moveDir(oldDir: string, newDir: string) {
  if (!fs.existsSync(oldDir)) {
    debug("skipping migration: oldDir does not exist " + oldDir)
    return
  }
  if (fs.existsSync(newDir)) {
    debug("skipping migration: newDir already exists " + newDir)
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
