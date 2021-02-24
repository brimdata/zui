import {NewTabSearchParams} from "../electron/ipc/windows/messages"
import {Store} from "../state/types"
import {submitSearch} from "../flows/submitSearch/mod"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Tabs from "../state/Tabs"
import {lakeSearchPath} from "app/router/utils/paths"

export default function(store: Store, params: NewTabSearchParams) {
  const {workspaceId, spaceId, span, program, isNewWin} = params
  if (!isNewWin) {
    store.dispatch(Tabs.new())
  }

  global.tabHistory.push(
    lakeSearchPath(spaceId, workspaceId, {program, spanArgs: span})
  )
  // Maybe we don't need any of this anymore.... vvv
  store.dispatch(Search.setSpanArgs(span))
  store.dispatch(SearchBar.removeAllSearchBarPins())
  store.dispatch(SearchBar.changeSearchBarInput(program))
  store.dispatch(submitSearch())
}
