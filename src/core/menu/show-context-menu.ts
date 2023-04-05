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
    global.zui.invoke("showContextMenuOp", template, opts)
  }
}
