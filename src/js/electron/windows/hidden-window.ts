import {WindowName} from "../windows/types"
import {ZuiWindow} from "./zui-window"

export class HiddenWindow extends ZuiWindow {
  name: WindowName = "hidden"
  persistable = false
  options = {
    show: false,
    width: 0,
    height: 0,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  }

  beforeLoad() {
    this.ref.setMenu(null)
  }

  touch() {
    this.lastFocused = 0
  }
}
