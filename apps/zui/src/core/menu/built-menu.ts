import {MenuItemConstructorOptions} from "electron"
import {menus} from "./global-menus"
import {Menu} from "./menu"
import {popupPosition} from "./popup-position"
import {showContextMenu} from "./show-context-menu"
import {MenuInfo, MenuItem} from "./types"

export class BuiltMenu {
  constructor(public info: MenuInfo, public template: MenuItem[]) {}

  get items() {
    return this.template
  }

  get label() {
    return this.info.label ?? this.info.id
  }

  show() {
    showContextMenu(this.toElectron())
  }

  showUnder(target: HTMLElement) {
    showContextMenu(this.toElectron(), popupPosition(target))
  }

  toElectron(): MenuItemConstructorOptions[] {
    return this.template.map((opt) => {
      const {nestedMenu, checked, ...rest} = opt
      let option: MenuItemConstructorOptions = {...(rest as any)}
      if (nestedMenu) {
        if (nestedMenu instanceof Menu) {
          option.submenu = menus.build(nestedMenu.id)
        }
      }
      if (checked !== undefined) {
        option.type = "checkbox"
      }
      return option
    })
  }
}
