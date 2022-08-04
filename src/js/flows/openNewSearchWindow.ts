import ipc from "../electron/ipc"
import invoke from "../electron/ipc/invoke"
import {Thunk} from "../state/types"
import Current from "../state/Current"
import SearchBar from "../state/SearchBar"
import {lakeQueryPath} from "src/app/router/utils/paths"
import Queries from "../state/Queries"

export const openNewSearchTab = (): Thunk => {
  return (dispatch, getState) => {
    const state = getState()
    const lakeId = Current.getLakeId(state)
    const pool = Current.getQueryPool(state)
    const {current} = SearchBar.getSearchBar(state)
    const query = dispatch(
      Queries.create({value: current, pins: [{type: "from", value: pool.id}]})
    )
    invoke(
      ipc.windows.newSearchTab({
        href: lakeQueryPath(query.id, lakeId, query.latestVersionId()),
      })
    )
  }
}
