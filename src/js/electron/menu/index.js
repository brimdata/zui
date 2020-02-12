/* @flow */
import {BrowserWindow, Menu} from "electron"

import type {$WindowManager, WindowName} from "../tron/windowManager"
import actions from "./actions"
import fieldContextMenu from "./fieldContextMenu"
import loginAppMenu from "./loginAppMenu"
import searchAppMenu from "./searchAppMenu"

export type $MenuItem =
  | {click: Function, label: string, enabled: boolean}
  | {type: "separator"}
export type $Menu = $MenuItem[]

function getBuilder(name) {
  switch (name) {
    case "search":
      return searchAppMenu
    default:
      return null
  }
}

function setMenu(
  name: WindowName,
  browserWindow: BrowserWindow,
  manager: $WindowManager
) {
  let builder = getBuilder(name)

  if (builder) {
    let template = builder(browserWindow.webContents.send, manager)
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  }
}

export default {
  setMenu,
  actions,
  fieldContextMenu,
  loginAppMenu,
  searchAppMenu,
  separator: () => ({type: "separator"})
}
