import {env} from "src/zui"
import {configurations} from "src/zui"
import {spawn, ChildProcess} from "child_process"
import {error, debug} from "electron-log"
import {pluginNamespace, suricataLocalRulesPropName} from "../config"

let proc: ChildProcess = null

function updateSuricata() {
  const exe = env.getExePath("suricata/suricataupdater")
  const suricataLocalRulesPath =
    configurations.get(pluginNamespace, suricataLocalRulesPropName) || ""

  if (suricataLocalRulesPath) {
    proc = spawn(exe, ["--local", suricataLocalRulesPath])
  } else {
    proc = spawn(exe)
  }

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
