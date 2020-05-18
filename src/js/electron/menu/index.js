/* @flow */
import {BrowserWindow, Menu} from "electron"

import type {$WindowManager} from "../tron/windowManager"
import actions from "./actions"
import appMenu from "./appMenu"
import detailFieldContextMenu from "./detailFieldContextMenu"
import searchFieldContextMenu from "./searchFieldContextMenu"

export type $MenuItem =
  | {click?: Function, label: string, enabled?: boolean}
  | {type: "separator"}
export type $Menu = $MenuItem[]

function setMenu(manager: $WindowManager, store: *) {
  function send(...args) {
    let win = BrowserWindow.getFocusedWindow()
    if (win && win.webContents) win.webContents.send(...args)
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(appMenu(send, manager, store)))
}

export default {
  setMenu,
  actions,
  searchFieldContextMenu,
  detailFieldContextMenu,
  separator: () => ({type: "separator"})
}
