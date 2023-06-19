import fs from "fs-extra"
import {debug, error} from "electron-log"

export function removeDirIfEmpty(dir: string) {
  debug("removing directory " + dir)

  if (!fs.existsSync(dir)) {
    debug("skipping removal: dir does not exist " + dir)
    return
  }

  if (fs.existsSync(dir) && fs.readdirSync(dir).length > 0) {
    debug("skipping removal: dir has content " + dir)
    return
  }

  try {
    fs.removeSync(dir)
    debug("successfully removed empty folder " + dir)
  } catch (e) {
    error("error removing folder:", e)
  }
}
