/* @flow */

import actions from "./actions"
import fieldContextMenu from "./fieldContextMenu"
import loginAppMenu from "./loginAppMenu"
import searchAppMenu from "./searchAppMenu"

export default {
  actions,
  fieldContextMenu,
  loginAppMenu,
  searchAppMenu,
  separator: () => ({type: "separator"})
}
