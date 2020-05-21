/* @flow */
import type {Dispatch} from "../state/types"
import menu from "../electron/menu"

export default function(dispatch: Dispatch) {
  for (let name in menu.actions.search) {
    menu.actions.search[name].listen(dispatch)
  }
  for (let name in menu.actions.detail) {
    menu.actions.detail[name].listen(dispatch)
  }
  for (let name in menu.actions.space) {
    menu.actions.space[name].listen(dispatch)
  }
}
