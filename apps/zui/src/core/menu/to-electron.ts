import {MenuItemConstructorOptions} from "electron"
import {MenuItem} from "./types"

export function toElectron(menu: MenuItem[]) {
  return menu.map((opt) => {
    const {nestedMenu, checked, ...rest} = opt
    // add items here
    let option: MenuItemConstructorOptions = {...(rest as any)}
    if (nestedMenu) {
      option.submenu = toElectron(nestedMenu)
    }
    if (checked !== undefined) {
      option.type = "checkbox"
      option.checked = checked
    }
    return option
  })
}
