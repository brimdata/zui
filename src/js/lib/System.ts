import {remote, MenuItemConstructorOptions} from "electron"

export function showContextMenu(template: MenuItemConstructorOptions[]) {
  if (process.env.BRIM_ITEST === "true") {
    document.dispatchEvent(
      new CustomEvent("nativeContextMenu", {detail: template})
    )
  } else {
    // @ts-ignore
    new remote.Menu.buildFromTemplate(template).popup()
  }
}
