import {app} from "electron"
import {join} from "path"
import {moveDir} from "../utils/move-dir"

export default function migrateBrimcapRoot() {
  const userData = app.getPath("userData")
  const oldDir = join(userData, "data", "brimcap-root")
  const newDir = join(userData, "plugins", "brimcap", "storage", "root")

  moveDir(oldDir, newDir)
}
