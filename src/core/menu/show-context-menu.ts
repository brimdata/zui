import * as remote from "@electron/remote"
import {MenuItemConstructorOptions, PopupOptions} from "electron"
import env from "src/app/core/env"

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
