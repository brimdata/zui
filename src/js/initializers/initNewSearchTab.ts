import {NewTabSearchParams} from "../electron/ipc/windows/messages"
import Tabs from "../state/Tabs"
import {Store} from "../state/types"

export default function(store: Store, params: NewTabSearchParams) {
  console.log(params)
  const {href, isNewWin} = params
  if (!isNewWin) {
    store.dispatch(Tabs.new(href))
  } else {
    // TODO
  }
}
