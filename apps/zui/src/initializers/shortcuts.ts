import {BrowserWindow} from "electron"
import shortcuts from "electron-localshortcut"

export function initialize() {
  function zoom(dir: "in" | "out", win: BrowserWindow | undefined) {
    const web = win && win.webContents
    if (!web) return
    const level = web.getZoomLevel()
    web.setZoomLevel(level + (dir === "in" ? 0.5 : -0.5))
  }

  // Had to add our own zoom handlers because of a bug in electron
  // https://github.com/electron/electron/issues/15496
  // https://github.com/electron/electron/issues/1507
  // This registers a shortcut whenever our app is focused
  shortcuts.register("CommandOrControl+=", () => {
    zoom("in", BrowserWindow.getFocusedWindow())
  })
  shortcuts.register("CommandOrControl+Shift+-", () => {
    zoom("out", BrowserWindow.getFocusedWindow())
  })
}
