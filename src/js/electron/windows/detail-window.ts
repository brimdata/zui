import {WindowName} from "../windows/types"
import {ZuiWindow} from "./zui-window"

export class DetailWindow extends ZuiWindow {
  name: WindowName = "detail"
  persistable: false
  options = {
    resizable: true,
    width: 680,
    height: 480,
    minWidth: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  }

  beforeLoad() {
    this.ref.setMenu(null)
  }
}
