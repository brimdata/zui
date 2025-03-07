import {Menu, BrowserWindowConstructorOptions, dialog} from "electron"
import env from "src/core/env"
import {WindowName} from "../types"
import {ZuiWindow} from "../zui-window"
import {createMenu, SearchAppMenuState} from "./app-menu"

export class SearchWindow extends ZuiWindow {
  persistable = true
  name: WindowName = "search"
  path = "/search"
  options: BrowserWindowConstructorOptions = {
    titleBarStyle: env.isMac ? "hidden" : undefined,
    vibrancy: "sidebar",
    backgroundColor: env.isMac ? undefined : "#F3F3F3",
    trafficLightPosition: {x: 16, y: 13},
    resizable: true,
    minWidth: 480,
    minHeight: 100,
    width: 1470,
    height: 900,
  }
  loadsInProgress = 0

  updateAppMenu(state: SearchAppMenuState) {
    Menu.setApplicationMenu(createMenu(this, state))
  }

  onFocus(): void {
    this.send("updateSearchAppMenu")
  }

  onClose(e: Electron.Event) {
    if (this.loadsInProgress !== 0) {
      const resp = dialog.showMessageBoxSync(this.ref, {
        message: "Abort the load?",
        detail:
          "Closing the window will abort the load. Are you sure you want to close?",
        buttons: ["OK", "Cancel"],
        defaultId: 0,
        cancelId: 1,
      })
      if (resp === 1) e.preventDefault()
    }
  }
}
