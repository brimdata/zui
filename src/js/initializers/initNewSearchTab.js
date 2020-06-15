/* @flow */

import type {Dispatch, Store} from "../state/types"
import type {NewTabSearchParams} from "../electron/ipc/windows/messages"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Tabs from "../state/Tabs/flows"
import submitSearch from "../flows/submitSearch"

export default function(
  store: Store,
  dispatch: Dispatch,
  params: NewTabSearchParams
) {
  const {spaceId, span, program, isNewWin} = params

  if (!isNewWin) {
    dispatch(Tabs.new())
  }

  dispatch(Search.setSpace(spaceId))
  dispatch(Search.setSpanArgs(span))
  dispatch(SearchBar.removeAllSearchBarPins())
  dispatch(SearchBar.changeSearchBarInput(program))
  dispatch(submitSearch())
}
