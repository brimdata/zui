/* @flow */
import type {Dispatch} from "../state/types"
import menu from "../electron/menu"

export default function(dispatch: Dispatch) {
  for (let name in menu.actions) {
    menu.actions[name].listen(dispatch)
  }
}
