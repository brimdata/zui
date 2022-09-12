import BrimApi from "src/js/api"
import {commands} from "../commands/command"
import {handleDropdown} from "./handle-dropdown"

type MenuItem =
  | Electron.MenuItemConstructorOptions & {
      command?: string | {id: string}
    }

type MenuContext = {api: BrimApi}
type MenuBuilder = (ctx: MenuContext) => MenuItem[]

class Menu {
  constructor(public id: string, public builder: MenuBuilder) {}

  get dropdownHandler() {
    return handleDropdown(this.id)
  }
}

function toElectron(opts: MenuItem[]) {
  for (let opt of opts) {
    if ("command" in opt) {
      opt.click = () => commands.run(opt.command)
    }
  }
  return opts
}

class MenuManager {
  map = new Map<string, Menu>()
  ctx: MenuContext | null = null

  get context() {
    if (this.ctx) return this.ctx
    throw new Error("First provide a context before building a menu")
  }

  setContext(api: BrimApi) {
    this.ctx = {api}
  }

  add(menu: Menu) {
    this.map.set(menu.id, menu)
  }

  build(id: string) {
    const menu = this.map.get(id)
    if (menu) {
      return toElectron(menu.builder(this.context))
    } else {
      throw new Error("No menu with id: " + id)
    }
  }
}

export const menus = new MenuManager()

export function createMenu(id: string, builder: MenuBuilder) {
  const menu = new Menu(id, builder)
  menus.add(menu)
  return menu
}
