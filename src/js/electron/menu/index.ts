import {BrowserWindow, Menu, MenuItemConstructorOptions} from "electron"

import {$WindowManager} from "../tron/windowManager"
import actions from "./actions"
import appMenu from "./appMenu"
import detailFieldContextMenu from "./detailFieldContextMenu"
import searchFieldContextMenu from "./searchFieldContextMenu"

export type $MenuItem = MenuItemConstructorOptions
export type $Menu = $MenuItem[]

function setMenu(manager: $WindowManager, store: any, session: any) {
  function send(channel, ...args) {
    let win = BrowserWindow.getFocusedWindow()
    if (win && win.webContents) win.webContents.send(channel, ...args)
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
  separator: (): MenuItemConstructorOptions => ({type: "separator"})
}
