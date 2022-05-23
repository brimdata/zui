import ipc from "../electron/ipc"
import invoke from "../electron/ipc/invoke"
import Search from "../state/Search"
import {Thunk} from "../state/types"
import {featureIsEnabled} from "src/app/core/feature-flag"
import {newQuery} from "src/app/query-home/flows/new-query"
import Current from "../state/Current"
import SearchBar from "../state/SearchBar"
import {lakeQueryPath} from "src/app/router/utils/paths"

export const legacyOpenNewSearchTab = (): Thunk => (dispatch, getState) => {
  const href = Search.createHref(getState())
  invoke(ipc.windows.newSearchTab({href}))
}

export const openNewSearchTab = (): Thunk => {
  if (!featureIsEnabled("query-flow")) return legacyOpenNewSearchTab()
  return (dispatch, getState) => {
    const state = getState()
    const lakeId = Current.getLakeId(state)
    const pool = Current.getQueryPool(state)
    const {current} = SearchBar.getSearchBar(state)
    const query = dispatch(
      newQuery({value: current, pins: [{type: "from", value: pool.id}]})
    )
    invoke(
      ipc.windows.newSearchTab({
        href: lakeQueryPath(query.id, lakeId),
      })
    )
  }
}
