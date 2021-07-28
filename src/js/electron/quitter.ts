import env from "app/core/env"
import {app} from "electron"
import {BrimMain} from "./brim"

export function handleQuit(brim: BrimMain) {
  app.on("before-quit", async (e) => {
    if (brim.isQuitting) return
    e.preventDefault()
    await brim.quit()
  })

  app.on("window-all-closed", async () => {
    if (env.isMac) return
    // Strangely, this event fires before the "closed" event on the window is fired,
    // where we dereference the window. Here we check to make sure all the windows
    // have indeed been dereferenced before we quit the app.
    await brim.windows.whenAllClosed()
    app.quit()
  })
}
