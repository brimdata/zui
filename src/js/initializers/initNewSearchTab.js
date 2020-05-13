/* @flow */

import type {Dispatch, Store} from "../state/types"
import Search from "../state/Search"
import Tabs from "../state/Tabs/flows"
import SearchBar from "../state/SearchBar"
import submitSearch from "../flows/submitSearch"

export default function(store: Store, dispatch: Dispatch, params: Object) {
  const {spaceId, spaceName, span, program, isNewWin} = params

  if (!isNewWin) {
    dispatch(Tabs.new())
  }

  dispatch(Search.setSpace(spaceId, spaceName))
  dispatch(Search.setSpanArgs(span))
  dispatch(SearchBar.removeAllSearchBarPins())
  dispatch(SearchBar.changeSearchBarInput(program))
  dispatch(submitSearch())
}
