import {WindowName} from "../windows/types"
import {ZuiWindow} from "./zui-window"
import path from "path"

export class DetailWindow extends ZuiWindow {
  name: WindowName = "detail"
  persistable: false
  options = {
    resizable: true,
    width: 680,
    height: 480,
    minWidth: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  }

  beforeLoad() {
    this.ref.setMenu(null)
  }
}
