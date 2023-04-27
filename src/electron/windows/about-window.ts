import {WindowName} from "./types"
import {ZuiWindow} from "./zui-window"

export class AboutWindow extends ZuiWindow {
  name: WindowName = "about"
  path: "/about"
  options = {
    width: 360,
    height: 360,
    resizable: false,
    minimizable: false,
    maximizable: false,
  }

  beforeLoad() {
    this.ref.setMenu(null)
    this.ref.center()
  }
}
