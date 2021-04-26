import tabHistory from "app/router/tab-history"
import {lakeSearchPath} from "app/router/utils/paths"
import brim from "src/js/brim"
import Investigation from "src/js/state/Investigation"
import Current from "../../state/Current"
import Notice from "../../state/Notice"
import Search from "../../state/Search"
import SearchBar from "../../state/SearchBar"
import Tab from "../../state/Tab"
import {Thunk} from "../../state/types"

type SaveOpts = {history: boolean; investigation: boolean}

export function submitSearch(
  save: SaveOpts = {history: true, investigation: true},
  ts: Date = new Date()
): Thunk<Promise<void>> {
  return function(dispatch, getState) {
    dispatch(Notice.dismiss())
    const record = Search.getRecord(getState())
    const spanArgsFocus = Tab.getSpanFocus(getState())
    const workspaceId = Current.getWorkspaceId(getState())
    const poolId = Current.getPoolId(getState())

    dispatch(Tab.computeSpan(ts))

    if (!dispatch(SearchBar.validate())) return Promise.reject()

    const url = lakeSearchPath(poolId, workspaceId, {...record, spanArgsFocus})

    if (save.investigation) {
      dispatch(
        Investigation.push(workspaceId, poolId, record, brim.time(ts).toTs())
      )
    }

    save.history
      ? dispatch(tabHistory.push(url))
      : dispatch(tabHistory.replace(url))
  }
}
