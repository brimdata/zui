/* @flow */

import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"
import type {Thunk} from "redux-thunk"
import Tab from "../state/Tab"
import SearchBar from "../state/SearchBar"

export const openNewSearchTab = (): Thunk => (dispatch, getState) => {
  const state = getState()

  const params = {
    space: Tab.spaceName(state),
    span: Tab.getSpan(state),
    program: SearchBar.getSearchBarInputValue(state)
  }

  invoke(ipc.windows.newSearchTab(params))
}
