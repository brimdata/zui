import {env} from "src/zui"
import {spawn, ChildProcess} from "child_process"
import {error, debug} from "electron-log"

let proc: ChildProcess = null

function updateSuricata() {
  const exe = env.getExePath("suricata/suricataupdater")
  proc = spawn(exe)
  proc
    .on("error", (e) => {
      error(`Error updating Suricata rules: ${e.message || e}`)
    })
    .on("close", () => {
      debug("Closing suricata updater")
    })
}

export function activateSuricataUpdater() {
  if (env.isTest) return
  updateSuricata()
}
