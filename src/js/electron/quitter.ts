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
      await zqd.close()
      app.quit()
    } else {
      quitting = false
    }
  })

  app.on("window-all-closed", async () => {
    if (process.platform === "darwin") return
    // Strangely, this event fires before the "closed" event on the window is fired,
    // where we dereference the window. Here we check to make sure all the windows
    // have indeed been dereferenced before we quit the app.
    await manager.whenAllClosed()
    app.quit()
  })
}
