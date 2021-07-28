import env from "app/core/env"
import {MenuItemConstructorOptions, remote, PopupOptions} from "electron"

export function showContextMenu(
  template: MenuItemConstructorOptions[],
  opts: PopupOptions = {}
) {
  if (env.isTest) {
    document.dispatchEvent(
      new CustomEvent("nativeContextMenu", {detail: template})
    )
  } else {
    // @ts-ignore
    new remote.Menu.buildFromTemplate(template).popup(opts)
  }
}

export function showMessageBox(opts: Electron.MessageBoxOptions) {
  if (env.isTest) {
    return Promise.resolve({response: 0})
    // To do, mock the options and give the test case a way to select some
  } else {
    return remote.dialog.showMessageBox(opts)
  }
}
