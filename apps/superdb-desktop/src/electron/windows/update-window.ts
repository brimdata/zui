import {BrowserWindowConstructorOptions} from "electron"
import {WindowName} from "./types"
import {ZuiWindow} from "./zui-window"

export class UpdateWindow extends ZuiWindow {
  name: WindowName = "update"
  path = "/update"
  options: BrowserWindowConstructorOptions = {
    titleBarStyle: "hidden",
    frame: false,
    vibrancy: "window",
    width: 260,
    height: 335,
    resizable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
  }

  beforeLoad() {
    this.ref.setMenu(null)
    this.ref.center()
  }
}
