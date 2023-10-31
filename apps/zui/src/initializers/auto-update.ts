// import log from "electron-log"
// import {setupAutoUpdater} from "../electron/autoUpdater"
import {MainObject} from "../core/main/main-object"
// import isDev from "../electron/isDev"
import {appUpdater} from "src/domain/updates/app-updater"
import {configurations} from "src/zui"

export function initialize(main: MainObject) {
  // autoUpdater should not run in dev, and will fail if the code has not been signed
  // if (!isDev && main.args.autoUpdater) {
  //   setupAutoUpdater(main).catch((err) => {
  //     log.error("Failed to initiate autoUpdater: " + err)
  //   })
  // }

  let prev = null
  main.store.subscribe(() => {
    const mode = configurations.get("application", "updateMode")
    if (mode !== prev) {
      appUpdater.initialize(main.store, mode)
    }
  })
}
