/* @flow */

import {BrowserWindow, Menu} from "electron"

import type {WindowName} from "../lib/window"
import {createLoginMenuTemplate} from "./menus/loginMenu"
import {createSearchMenuTemplate} from "./menus/searchMenu"

export function setAppMenu(name: WindowName, win: BrowserWindow) {
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
    case "search":
      return createSearchMenuTemplate
    case "login":
      return createLoginMenuTemplate
    default:
      throw "Unknown Menu"
  }
}
