import {Store} from "../state/types"
import menu from "../electron/menu"

export default function(store: Store) {
  for (const name in menu.actions.search) {
    menu.actions.search[name].listen(store.dispatch)
  }
  for (const name in menu.actions.detail) {
    menu.actions.detail[name].listen(store.dispatch)
  }
  for (const name in menu.actions.space) {
    menu.actions.space[name].listen(store.dispatch)
  }
}
