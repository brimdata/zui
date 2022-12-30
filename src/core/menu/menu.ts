import {BuiltMenu} from "./built-menu"
import {menus} from "./global-menus"
import {MenuBuilder} from "./types"

export class Menu<Args extends any[] = []> {
  constructor(public id: string, private builder: MenuBuilder<Args>) {}

  build(...args: Args) {
    return new BuiltMenu(this.builder(menus.context, ...args))
  }
}
