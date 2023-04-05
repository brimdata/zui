import {WindowName} from "../windows/types"
import {ZuiWindow} from "./zui-window"
import path from "path"

export class AboutWindow extends ZuiWindow {
  name: WindowName = "about"
  options = {
    width: 360,
    height: 360,
    resizable: false,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  }

  beforeLoad() {
    this.ref.setMenu(null)
    this.ref.center()
  }
}
