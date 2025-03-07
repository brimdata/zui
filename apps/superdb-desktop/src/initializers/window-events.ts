import {app, autoUpdater} from "electron"
import log from "electron-log"
import env from "src/core/env"
import {MainObject} from "../core/main/main-object"
import {moveToCurrentDisplayOp} from "../electron/ops/move-to-current-display-op"
import {debug} from "src/core/log"

export function initialize(main: MainObject) {
  app.on("second-instance", (e, argv) => {
    for (let arg of argv) {
      switch (arg) {
        case "--new-window":
          main.windows.create("search")
          break
        case "--move-to-current-display":
          moveToCurrentDisplayOp()
          break
      }
    }
  })

  app.on("open-url", (event, url) => {
    // recommended to preventDefault in docs: https://www.electronjs.org/docs/api/app#event-open-url-macos
    event.preventDefault()
    log.info("Opening url:", url)
    main.openUrl(url)
  })

  app.on("activate", () => {
    if (main.windows.singleHidden) {
      main.windows.unhideAll()
    } else if (main.windows.visible.length === 0) {
      main.windows.create("search")
    }
  })

  main.windows.on("window-will-close", (e) => {
    debug("window-will-close", "isQuitting:", main.isQuitting)
    if (!main.isQuitting && main.windows.visible.length === 1) {
      e.preventDefault()
      if (env.isMac) {
        main.windows.visible[0].ref.hide()
      } else {
        app.quit()
      }
    }
  })

  // Looks like this gets called twice on linux and windows
  app.on("before-quit", () => {
    debug("before-quit")
    main.onBeforeQuit()
  })

  // https://www.electronjs.org/docs/latest/api/auto-updater#event-before-quit-for-update
  // When autoUpdater.quitAndInstall() is called, the "before-quit" event doesn't fire
  autoUpdater.on("before-quit-for-update", () => {
    debug("before-quit-for-update")
    main.onBeforeQuit()
  })

  app.on("will-quit", () => {
    debug("will-quit")
    main.stop()
  })
}
