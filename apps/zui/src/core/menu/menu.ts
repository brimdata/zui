import {BuiltMenu} from "./built-menu"
import {menus as globalMenus} from "./global-menus"
import {MenuBuilder} from "./types"

export class Menu<Args extends any[] = []> {
  constructor(public id: string, private builder: MenuBuilder<Args>) {}

  build(...args: Args) {
    return new BuiltMenu(
      {id: this.id},
      this.builder(globalMenus.context, ...args)
    )
  }
}
