import {menus} from "./global-menus"
import {Menu} from "./menu"
import {MenuBuilder} from "./types"

export function createMenu<Args extends any[] = []>(
  id: string,
  builder: MenuBuilder<Args>
) {
  const menu = new Menu<Args>(id, builder)
  menus.add(menu)
  return menu
}
