import {app, dialog} from "electron"
import {main} from "./run-main/run-main"
import log from "electron-log"

process.on("unhandledRejection", (e) => {
  log.error(e)
})

main().catch((e) => {
  dialog.showErrorBox("This Error Prevented The App From Starting", e.stack)
  app.quit()
})
