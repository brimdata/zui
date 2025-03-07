import {MenuItemConstructorOptions} from "electron"
import {BoundCommand} from "src/app/commands/command"
import {invoke} from "src/core/invoke"
import {MenuItem} from "./types"
import {toElectron} from "./to-electron"
import {popupPosition} from "./popup-position"
import {handleClick} from "./handle-click"

export function showMenu(menu: MenuItem[], target?: HTMLElement) {
  if (target) {
    showContextMenu(menu, popupPosition(target))
  } else {
    showContextMenu(menu)
  }
}

export function showContextMenu(
  items: MenuItem[],
  opts: {x?: number; y?: number; callback?: () => void} = {}
) {
  const template = toElectron(items)
  if (global.env.isIntegrationTest) {
    document.dispatchEvent(
      new CustomEvent("nativeContextMenu", {detail: template})
    )
  } else {
    const {callback, x, y} = opts
    const menu = sanitizeTemplate(template)
    setupListener(template, callback)
    invoke("showContextMenuOp", menu, {x, y})
  }
}

function sanitizeTemplate(template: MenuItemConstructorOptions[]) {
  return template.map((item) => sanitizeMenuItem(item))
}

function sanitizeMenuItem(item: any) {
  const sanitizedItem = {
    ...item,
    click: undefined,
    command: item.command instanceof BoundCommand ? undefined : item.command,
  }
  if (item.submenu) {
    sanitizedItem.submenu = sanitizeTemplate(item.submenu)
  }
  return sanitizedItem
}

function findItem(id: string, template: MenuItemConstructorOptions[]) {
  for (let item of template) {
    if (item.id === id || item.label === id) return item
    if (item.submenu) {
      const result = findItem(id, item.submenu as MenuItemConstructorOptions[])
      if (result) return result
    }
  }
  return null
}

function setupListener(template, callback) {
  global.zui.once("contextMenuResult", (e, id: string) => {
    const item = findItem(id, template) as unknown as MenuItem
    if (item) {
      handleClick(item)
    }
    callback && callback()
  })
}
