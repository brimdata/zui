/* @flow */
import {BrowserWindow, Menu} from "electron"

import type {$WindowManager} from "../tron/windowManager"
import actions from "./actions"
import appMenu from "./appMenu"
import detailFieldContextMenu from "./detailFieldContextMenu"
import searchFieldContextMenu from "./searchFieldContextMenu"
import spaceContextMenu from "./spaceContextMenu"

export type $MenuItem =
  | {click?: Function, label: string, enabled?: boolean}
  | {type: "separator"}
export type $Menu = $MenuItem[]

function setMenu(manager: $WindowManager, store: *, session: *) {
  function send(...args) {
    let win = BrowserWindow.getFocusedWindow()
    if (win && win.webContents) win.webContents.send(...args)
  }

  Menu.setApplicationMenu(
    Menu.buildFromTemplate(appMenu(send, manager, store, session))
  )
}

export default {
  setMenu,
  actions,
  searchFieldContextMenu,
  detailFieldContextMenu,
  spaceContextMenu,
  separator: () => ({type: "separator"})
}
