import {ipcRenderer} from "electron"

export default {
  log: (...args: string[]) => {
    return ipcRenderer.invoke("windows:log", {id: global.windowId, args: args})
  }
}
