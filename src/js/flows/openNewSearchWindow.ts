import Current from "../state/Current"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"
import {Thunk} from "../state/types"

export const openNewSearchTab = (): Thunk => (dispatch, getState) => {
  const state = getState()

  const params = {
    spaceId: Current.getSpaceId(state),
    span: Tab.getSpan(state),
    program: SearchBar.getSearchBarInputValue(state)
  }
  // $FlowFixMe
  invoke(ipc.windows.newSearchTab(params))
}
