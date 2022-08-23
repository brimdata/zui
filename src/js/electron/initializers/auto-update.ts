import log from "electron-log"
import {setupAutoUpdater} from "../autoUpdater"
import {BrimMain} from "../brim"
import isDev from "../isDev"

export function initialize(main: BrimMain) {
  // autoUpdater should not run in dev, and will fail if the code has not been signed
  if (!isDev && main.args.autoUpdater) {
    setupAutoUpdater(main).catch((err) => {
      log.error("Failed to initiate autoUpdater: " + err)
    })
  }
}
