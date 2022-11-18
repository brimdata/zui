import {app} from "electron"
import log from "electron-log"
import env from "src/app/core/env"

export function setLogLevel() {
  if (env.isTest) return
  log.transports.console.level = getLevel()
}

function getLevel() {
  if (app.commandLine.hasSwitch("verbose")) {
    return "debug"
  } else {
    return "info"
  }
}
