import {app} from "electron"
import log from "electron-log"
import formatSessionState from "./tron/formatSessionState"
import {$WindowManager} from "./tron/windowManager"

export function handleQuit(manager: $WindowManager, store, session, zqd) {
  let quitting = false

  app.on("before-quit", async (e) => {
    log.debug("before-quit: quitting = ", quitting)
    if (quitting) return
    e.preventDefault()
    quitting = true
    if (await manager.confirmQuit()) {
      await manager.prepareQuit()
      session.save(
        formatSessionState(await manager.serialize(), store.getState())
      )
      manager.quit()
      app.quit()
    } else {
      quitting = false
    }
  })

  app.on("quit", () => {
    log.debug("closing zqd")
    zqd.close()
  })

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
  })
}
