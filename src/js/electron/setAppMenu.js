/* @flow */

import {BrowserWindow, Menu} from "electron"

import {createLoginMenuTemplate} from "./menus/loginMenu"
import {createSearchMenuTemplate} from "./menus/searchMenu"

type MenuName = "SEARCH" | "LOGIN"

export function setAppMenu(name: MenuName, win: BrowserWindow) {
  let builder = getTemplateBuilder(name)

  function send(message) {
    win.webContents.send(message)
  }

  let template = builder(send)
  let menu = Menu.buildFromTemplate(template)

  Menu.setApplicationMenu(menu)
  return menu
}

function getTemplateBuilder(name) {
  switch (name) {
    case "SEARCH":
      return createSearchMenuTemplate
    case "LOGIN":
      return createLoginMenuTemplate
    default:
      throw "Unknown Menu"
  }
}
