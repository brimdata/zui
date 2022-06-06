import ipc from "../electron/ipc"
import invoke from "../electron/ipc/invoke"
import {Thunk} from "../state/types"
import {newDraftQuery} from "src/app/query-home/flows/new-draft-query"
import Current from "../state/Current"
import SearchBar from "../state/SearchBar"
import {lakeQueryPath} from "src/app/router/utils/paths"

export const openNewSearchTab = (): Thunk => {
  return (dispatch, getState) => {
    const state = getState()
    const lakeId = Current.getLakeId(state)
    const pool = Current.getQueryPool(state)
    const {current} = SearchBar.getSearchBar(state)
    const query = dispatch(
      newDraftQuery({value: current, pins: [{type: "from", value: pool.id}]})
    )
    invoke(
      ipc.windows.newSearchTab({
        href: lakeQueryPath(query.id, lakeId),
      })
    )
  }
}
