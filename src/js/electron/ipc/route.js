/* @flow */
import {ipcRenderer} from "electron"

import type {IpcMsg} from "./types"

export default function route(message: IpcMsg) {
  return ipcRenderer.invoke(message.channel, message)
}
