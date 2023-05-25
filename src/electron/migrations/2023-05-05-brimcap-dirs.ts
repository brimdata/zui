import {app} from "electron"
import {join} from "path"
import {moveDir} from "../utils/move-dir"
import {removeDirIfEmpty} from "../utils/remove-dir-if-empty"

/**
 * Each plugin now has its own storage directory
 * where it can store its data.
 */
export default function migrateBrimcapDirs() {
  const userData = app.getPath("userData")

  moveDir(
    join(userData, "data", "brimcap-root"),
    join(userData, "plugins", "brimcap", "storage", "root")
  )

  moveDir(
    join(userData, "data", "suricata"),
    join(userData, "plugins", "brimcap", "storage", "suricata")
  )

  removeDirIfEmpty(join(userData, "data"))
}
