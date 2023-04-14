import {MenuItemConstructorOptions, PopupOptions} from "electron"

export function showContextMenu(
  template: MenuItemConstructorOptions[],
  opts: PopupOptions = {}
) {
  if (global.zui.env.isTest) {
    document.dispatchEvent(
      new CustomEvent("nativeContextMenu", {detail: template})
    )
  } else {
    const menu = sanitizeTemplate(template)
    setupListener(template)
    global.zui.invoke("showContextMenuOp", menu, opts)
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

function setupListener(template) {
  global.zui.listenOnce("contextMenuResult", (e, id: string) => {
    const item = findItem(id, template)
    // @ts-ignore
    if (item && "click" in item) item.click()
  })
}
