/* @flow */

import {remote} from "electron"

import {createLoginMenuTemplate} from "./menus/loginMenu"
import {createSearchMenuTemplate} from "./menus/searchMenu"

type MenuName = "SEARCH" | "LOGIN"

export function setAppMenu(name: MenuName, r: typeof remote = remote) {
  let builder = getTemplateBuilder(name)
  let template = builder(r.getCurrentWebContents().send)
  let menu = r.Menu.buildFromTemplate(template)

  r.Menu.setApplicationMenu(menu)
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
