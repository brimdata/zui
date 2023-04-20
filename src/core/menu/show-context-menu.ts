import {MenuItemConstructorOptions} from "electron"

export function showContextMenu(
  template: MenuItemConstructorOptions[],
  opts: {x?: number; y?: number; callback?: () => void} = {}
) {
  if (global.zui.env.isTest) {
    document.dispatchEvent(
      new CustomEvent("nativeContextMenu", {detail: template})
    )
  } else {
    const {callback, x, y} = opts
    const menu = sanitizeTemplate(template)
    setupListener(template, callback)
    global.zui.invoke("showContextMenuOp", menu, {x, y})
  }
}

function sanitizeTemplate(template: MenuItemConstructorOptions[]) {
  return template.map(sanitizeMenuItem)
}

function sanitizeMenuItem(item) {
  return {...item, click: undefined}
}

function findItem(id: string, template: MenuItemConstructorOptions[]) {
  return template.find((item) => item.id === id || item.label === id)
}

function setupListener(template, callback) {
  global.zui.listenOnce("contextMenuResult", (e, id: string) => {
    const item = findItem(id, template)
    // @ts-ignore
    if (item && "click" in item) item.click()
    callback && callback()
  })
}
