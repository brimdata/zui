import env from "src/app/core/env"
import {MenuItemConstructorOptions, PopupOptions} from "electron"
import * as remote from "@electron/remote"

export function showContextMenu(
  template: MenuItemConstructorOptions[],
  opts: PopupOptions = {}
) {
  if (env.isTest || env.isIntegrationTest) {
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
