import {MenuItem} from "src/core/menu"
import * as ops from "./operations"

export type MenusHandlers = {
  "menus.update": (
    menuId: string,
    itemId: string,
    update: Partial<MenuItem>
  ) => void
}

export type MenusOperations = {
  "menus.extend": typeof ops.extendMenu
}
