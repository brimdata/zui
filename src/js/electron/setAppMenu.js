/* @flow */

import {remote} from "electron"

import {createLoginMenuTemplate} from "./menus/loginMenu"
import {createSearchMenuTemplate} from "./menus/searchMenu"

type MenuName = "SEARCH" | "LOGIN"

export function setAppMenu(name: MenuName) {
  let builder = getTemplateBuilder(name)
  let template = builder(remote.getCurrentWebContents())
  let menu = remote.Menu.buildFromTemplate(template)

  remote.Menu.setApplicationMenu(menu)
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
