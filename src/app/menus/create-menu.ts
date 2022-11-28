import {MenuItemConstructorOptions} from "electron"
import BrimApi from "src/js/api"
import {showContextMenu} from "src/js/lib/System"
import {BoundCommand, commands} from "../commands/command"
import popupPosition from "../query-home/search-area/popup-position"
import {ActionButtonProps} from "../query-home/toolbar/actions/action-button"

type MenuItem =
  | Electron.MenuItemConstructorOptions & {
      command?: string | {id: string} | BoundCommand<any, any>
      nestedMenu?: Menu
    }

type MenuContext = {api: BrimApi}
type MenuBuilder<Args extends any[]> = (
  ctx: MenuContext,
  ...args: Args
) => MenuItem[]

class Menu<Args extends any[] = []> {
  constructor(public id: string, public builder: MenuBuilder<Args>) {}

  build(...args: Args) {
    return new BuiltMenu(menus.build(this.id, ...args))
  }
}

class BuiltMenu {
  constructor(public template: Electron.MenuItemConstructorOptions[]) {}

  show() {
    showContextMenu(this.template)
  }

  showUnder(target: HTMLElement) {
    showContextMenu(this.template, popupPosition(target))
  }
}

function toElectron(opts: MenuItem[]) {
  for (let opt of opts) {
    if ("command" in opt) {
      const command = opt.command
      delete opt.command
      opt.click =
        command instanceof BoundCommand
          ? () => command.run()
          : () => commands.run(command)
    }
    if ("nestedMenu" in opt) {
      if (opt.nestedMenu instanceof Menu) {
        opt.submenu = menus.build(opt.nestedMenu.id)
      }
    }
  }
  return opts
}

class MenuManager {
  map = new Map<string, Menu<any>>()
  ctx: MenuContext | null = null

  get context() {
    if (this.ctx) return this.ctx
    throw new Error("First provide a context before building a menu")
  }

  setContext(api: BrimApi) {
    this.ctx = {api}
  }

  add(menu: Menu<any>) {
    this.map.set(menu.id, menu)
  }

  build(id: string, ...args: any[]) {
    const menu = this.map.get(id)
    if (menu) {
      return toElectron(menu.builder(this.context, ...args))
    } else {
      throw new Error("No menu with id: " + id)
    }
  }
}

export function createMenu<Args extends any[] = []>(
  id: string,
  builder: MenuBuilder<Args>
) {
  const menu = new Menu<Args>(id, builder)
  menus.add(menu)
  return menu
}

/* The global object that stores all menus */
export const menus = new MenuManager()
