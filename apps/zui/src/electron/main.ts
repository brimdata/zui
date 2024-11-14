import {app, dialog} from "electron"
import {main} from "./run-main/run-main"
import log from "electron-log"

process.on("unhandledRejection", (e) => {
  log.error(e)
})

main().catch((e) => {
  log.error(e)
  log.info("The error above prevented the application from starting.")
  dialog.showErrorBox("This Error Prevented The App From Starting", e.stack)
  app.quit()
})
