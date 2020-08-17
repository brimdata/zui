/* @flow */

import type {NewTabSearchParams} from "../electron/ipc/windows/messages"
import type {Store} from "../state/types"
import Current from "../state/Current"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Tabs from "../state/Tabs"
import submitSearch from "../flows/submitSearch"

export default function(store: Store, params: NewTabSearchParams) {
  const {spaceId, span, program, isNewWin} = params

  if (!isNewWin) {
    store.dispatch(Tabs.new())
  }

  store.dispatch(Current.setSpaceId(spaceId))
  store.dispatch(Search.setSpanArgs(span))
  store.dispatch(SearchBar.removeAllSearchBarPins())
  store.dispatch(SearchBar.changeSearchBarInput(program))
  store.dispatch(submitSearch())
}
