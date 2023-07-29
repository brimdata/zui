import {WindowName} from "./types"
import {ZuiWindow} from "./zui-window"

export class DetailWindow extends ZuiWindow {
  name: WindowName = "detail"
  path = "/detail"
  persistable = false
  options = {
    resizable: true,
    width: 680,
    height: 480,
    minWidth: 500,
  }

  beforeLoad() {
    this.ref.setMenu(null)
  }
}
