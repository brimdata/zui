import {ipcRenderer} from "electron"

import {IpcMsg} from "./types"

export default function invoke(message: IpcMsg) {
  return ipcRenderer.invoke(message.channel, message)
}
