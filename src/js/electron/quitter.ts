import {app} from "electron"
import {Brim} from "./brim"

export function handleQuit(brim: Brim) {
  app.on("before-quit", async (e) => {
    if (brim.isQuitting) return
    e.preventDefault()
    await brim.quit()
  })

  app.on("window-all-closed", async () => {
    if (process.platform === "darwin") return
    // Strangely, this event fires before the "closed" event on the window is fired,
    // where we dereference the window. Here we check to make sure all the windows
    // have indeed been dereferenced before we quit the app.
    await brim.windows.whenAllClosed()
    app.quit()
  })
}
