import {WindowName} from "./types"
import {ZuiWindow} from "./zui-window"

export class HiddenWindow extends ZuiWindow {
  name: WindowName = "hidden"
  path: "/background"
  options = {
    show: false,
    width: 0,
    height: 0,
  }

  beforeLoad() {
    this.ref.setMenu(null)
  }

  touch() {
    this.lastFocused = 0
  }
}
