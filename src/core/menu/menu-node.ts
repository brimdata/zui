import {sendToFocusedWindow} from "../ipc"
import {MenuItem} from "./types"

class MenusApi {
  private menus: Map<string, MenuApi>

  constructor() {
    this.menus = new Map()
  }

  get(name: string) {
    const menu = this.menus.get(name)
    if (!menu) throw new Error("Could not find menu with name: " + name)
    return menu
  }

  add(menu: MenuApi) {
    this.menus.set(menu.name, menu)
  }
}
class MenuApi {
  constructor(public name: string, public template: MenuItem[]) {}

  update(id: string, props: Partial<MenuItem>) {
    sendToFocusedWindow("menus.update", this.name, id, props)
  }
}

export const menus = new MenusApi()

export function createMenu(id: string, template: MenuItem[]) {
  const menu = new MenuApi(id, template)
  menus.add(menu)
  return menus
}
