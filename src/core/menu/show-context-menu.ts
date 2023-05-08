import {MenuItemConstructorOptions} from "electron"
import {BoundCommand} from "src/app/commands/command"
import {invoke} from "src/core/invoke"

export function showContextMenu(
  template: MenuItemConstructorOptions[],
  opts: {x?: number; y?: number; callback?: () => void} = {}
) {
  if (global.env.isTest) {
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
  return {
    ...item,
    click: undefined,
    command: item.command instanceof BoundCommand ? undefined : item.command,
  }
}

function findItem(id: string, template: MenuItemConstructorOptions[]) {
  return template.find((item) => item.id === id || item.label === id)
}

function setupListener(template, callback) {
  global.zui.once("contextMenuResult", (e, id: string) => {
    const item = findItem(id, template)
    if (item && "click" in item) {
      // @ts-ignore
      item.click()
    } else if (
      item &&
      "command" in item &&
      item.command instanceof BoundCommand
    ) {
      item.command.run()
    }
    callback && callback()
  })
}
