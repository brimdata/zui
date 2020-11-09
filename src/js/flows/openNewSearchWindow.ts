import Current from "../state/Current"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"
import {Thunk} from "../state/types"

export const openNewSearchTab = (): Thunk => (dispatch, getState) => {
  const state = getState()

  const conn = Current.getConnection(state)
  const {host, port, id} = conn

  const params = {
    host,
    port,
    connId: id,
    spaceId: Current.getSpaceId(state),
    span: Tab.getSpan(state),
    program: SearchBar.getSearchBarInputValue(state)
  }

  invoke(ipc.windows.newSearchTab(params))
}
