import {WindowName} from "./types"
import {ZuiWindow} from "./zui-window"

export class DetailWindow extends ZuiWindow {
  name: WindowName = "detail"
  path = "/detail"
  persistable = false
  options = {
    resizable: true,
    width: 480,
    height: 680,
    minWidth: 300,
  }

  beforeLoad() {
    this.ref.setMenu(null)
  }
}
