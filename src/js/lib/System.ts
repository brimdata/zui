import {MenuItemConstructorOptions, PopupOptions} from "electron"
import {invoke} from "src/core/invoke"
import {showContextMenu as show} from "src/core/menu/show-context-menu"

// Remove this function
export async function showContextMenu(
  template: MenuItemConstructorOptions[],
  opts: PopupOptions = {}
) {
  show(template, opts)
}

export function showMessageBox(opts: Electron.MessageBoxOptions) {
  if (global.env.isTest) {
    return Promise.resolve({response: 0})
    // To do, mock the options and give the test case a way to select some
  } else {
    return invoke("showMessageBoxOp", opts)
  }
}
