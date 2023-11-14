import env from "src/app/core/env"
import {MainObject} from "../core/main/main-object"
import ConfigPropValues from "src/js/state/ConfigPropValues"
import {Scheduler} from "src/domain/updates/scheduler"
import {check} from "src/domain/updates/operations"
import {info} from "src/core/log"
import {app} from "electron"
import {onStateChange} from "src/core/on-state-change"

export function initialize(main: MainObject) {
  if (env.isTest) {
    info("Not Checking for Updates when env.isTest")
    return
  }

  app.whenReady().then(() => {
    const schedule = new Scheduler()
    onStateChange(
      main.store,
      ConfigPropValues.get("application", "updateMode"),
      (mode) => {
        info("Running Updater in Mode:", mode)
        schedule.stop()
        schedule.start(mode, check, {delay: 15_000})
      }
    )
  })
}
