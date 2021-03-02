import tabHistory from "app/router/tab-history"
import {lakeSearchPath} from "app/router/utils/paths"
import program from "../brim/program"
import span from "../brim/span"
import {NewTabSearchParams} from "../electron/ipc/windows/messages"
import {submitSearch} from "../flows/submitSearch/mod"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
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
