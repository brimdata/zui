import {MenuItemConstructorOptions} from "electron"

import actions from "./actions"

export type $MenuItem = MenuItemConstructorOptions
export type $Menu = $MenuItem[]

export default {
  actions,
  separator: (): MenuItemConstructorOptions => ({type: "separator"}),
}
