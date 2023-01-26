import {MenuItemConstructorOptions} from "electron"
import {BoundCommand, commands} from "src/app/commands/command"
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
    const opts = this.template
    for (let opt of opts) {
      if ("command" in opt) {
        const command = opt.command
        opt.click =
          command instanceof BoundCommand
            ? () => command.run()
            : () => commands.run(command)
      }
      if ("nestedMenu" in opt) {
        if (opt.nestedMenu instanceof Menu) {
          // @ts-ignore
          opt.submenu = menus.build(opt.nestedMenu.id)
        }
      }
      if ("checked" in opt) {
        // @ts-ignore
        opt.type = "checkbox"
      }
    }
    return opts as MenuItemConstructorOptions[]
  }
}
