/* @flow */

import actions from "./actions"
import fieldContextMenu from "./fieldContextMenu"
import loginAppMenu from "./loginAppMenu"
import searchAppMenu from "./searchAppMenu"

export type $MenuItem = {click: Function, label: string, enabled: boolean}
export type $Menu = $MenuItem[]

export default {
  actions,
  fieldContextMenu,
  loginAppMenu,
  searchAppMenu,
  separator: () => ({type: "separator"})
}
