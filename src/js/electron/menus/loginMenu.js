/* @flow */

import {MenuItem} from "electron"

import {createSearchMenuTemplate} from "./searchMenu"
import {isArray} from "../../lib/is"

export function createLoginMenuTemplate(send: Function) {
  let menu = createSearchMenuTemplate(send)

  disableChildren(menu, "Query")
  disable(menu, "Toggle Search History")
  disable(menu, "Toggle Log Details")

  if (process.platform === "darwin") {
    disable(menu, "Preferences...")
  }

  return menu
}

function disable(menu, label) {
  let item = findByLabel(menu, label)
  item.enabled = false
}

function disableChildren(menu, label) {
  let item = findByLabel(menu, label)
  item.submenu.forEach((i) => (i.enabled = false))
}

function findByLabel(menu, label): MenuItem {
  let item = find(menu, label)
  if (!item) throw `Unknown menu item "${label}"`
  return item
}

function find(item: MenuItem, label): MenuItem {
  if (item.label === label) return item
  if (item.submenu) return find(item.submenu, label)
  if (isArray(item)) {
    for (let i of item) {
      let found = find(i, label)
      if (found) return found
    }
  }
}
