import {app} from "electron"
import log from "electron-log"
import env from "src/app/core/env"
import {BrimMain} from "../brim"
import {moveToCurrentDisplayOp} from "../ops/move-to-current-display-op"

export function initialize(main: BrimMain) {
  app.on("second-instance", (e, argv) => {
    for (let arg of argv) {
      switch (arg) {
        case "--new-window":
          main.windows.create("search")
          break
        case "--move-to-current-display":
          moveToCurrentDisplayOp.run()
          break
      }
    }
  })

  app.on("activate", () => main.activate())

  app.on("open-url", (event, url) => {
    // recommended to preventDefault in docs: https://www.electronjs.org/docs/api/app#event-open-url-macos
    event.preventDefault()
    log.info("Opening url:", url)
    main.openUrl(url)
  })

  app.on("before-quit", async (e) => {
    if (main.isQuitting) return
    e.preventDefault()
    await main.quit()
  })

  app.on("window-all-closed", async () => {
    if (env.isMac) return
    // Strangely, this event fires before the "closed" event on the window is fired,
    // where we dereference the window. Here we check to make sure all the windows
    // have indeed been dereferenced before we quit the app.
    await new Promise<void>((resolve) => {
      const checkCount = () => {
        if (main.windows.count === 0) resolve()
        else setTimeout(checkCount, 0)
      }
      checkCount()
    })
    app.quit()
  })
}
