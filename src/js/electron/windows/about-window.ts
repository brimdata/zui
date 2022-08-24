import {WindowName} from "../windows/types"
import {ZuiWindow} from "./zui-window"

export class AboutWindow extends ZuiWindow {
  name: WindowName = "about"
  options = {
    width: 360,
    height: 360,
    resizable: false,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  }

  beforeLoad() {
    this.ref.setMenu(null)
    this.ref.center()
  }
}
