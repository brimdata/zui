/* @flow */
import {BrowserWindow, Menu} from "electron"

import type {$WindowManager} from "../tron/windowManager"
import actions from "./actions"
import appMenu from "./appMenu"
import fieldContextMenu from "./fieldContextMenu"

export type $MenuItem =
  | {click?: Function, label: string, enabled?: boolean}
  | {type: "separator"}
export type $Menu = $MenuItem[]

function setMenu(manager: $WindowManager) {
  let builder = appMenu

  function send(...args) {
    let win = BrowserWindow.getFocusedWindow()
    if (win && win.webContents) win.webContents.send(...args)
  }

  if (builder) {
    let template = builder(send, manager)
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  }
}

export default {
  setMenu,
  actions,
  fieldContextMenu,
  separator: () => ({type: "separator"})
}
