import env from "src/app/core/env"
import {MainObject} from "../core/main/main-object"
import {appUpdater} from "src/domain/updates/app-updater"
import {configurations} from "src/zui"

export function initialize(main: MainObject) {
  if (env.isTest) return

  let prev = null
  main.store.subscribe(() => {
    const mode = configurations.get("application", "updateMode")
    if (mode !== prev) {
      appUpdater.initialize(main.store, mode)
    }
  })
}
