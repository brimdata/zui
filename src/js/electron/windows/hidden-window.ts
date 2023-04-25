import {WindowName} from "../windows/types"
import {ZuiWindow} from "./zui-window"
import path from "path"

export class HiddenWindow extends ZuiWindow {
  name: WindowName = "hidden"
  options = {
    show: false,
    width: 0,
    height: 0,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  }

  beforeLoad() {
    this.ref.setMenu(null)
  }

  touch() {
    this.lastFocused = 0
  }

  load() {
    this.beforeLoad()
    return this.ref.loadURL(
      `http://localhost:3000/background?id=${this.id}&name=${this.name}`
    )
  }
}
