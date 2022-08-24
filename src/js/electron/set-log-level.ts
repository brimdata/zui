import {app} from "electron"
import log from "electron-log"

export function setLogLevel() {
  log.transports.console.level = getLevel()
}

function getLevel() {
  if (app.commandLine.hasSwitch("verbose")) {
    return "debug"
  } else {
    return "info"
  }
}
