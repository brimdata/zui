import {app} from "electron"
import {join} from "path"
import {moveDir} from "../utils/move-dir"

export default function migrateSuricataData() {
  const userData = app.getPath("userData")
  const oldDir = join(userData, "data", "suricata")
  const newDir = join(userData, "plugins", "suricata", "storage")

  moveDir(oldDir, newDir)
}
