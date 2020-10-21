import {app} from "electron"
import formatSessionState from "./tron/formatSessionState"
import {$WindowManager} from "./tron/windowManager"

export function handleQuit(manager: $WindowManager, store, session, zqd) {
  let quitting = false

  app.on("before-quit", async (e) => {
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
    zqd.close()
  })

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
  })
}
