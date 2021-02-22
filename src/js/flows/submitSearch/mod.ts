import {Thunk} from "../../state/types"
import Notice from "../../state/Notice"
import Search from "../../state/Search"
import SearchBar from "../../state/SearchBar"
import Tab from "../../state/Tab"
import Current from "../../state/Current"
import {encodeSearchParams} from "app/search/utils/search-params"
import brim from "src/js/brim"
import Investigation from "src/js/state/Investigation"

type SaveOpts = {history: boolean; investigation: boolean}

export function submitSearch(
  save: SaveOpts = {history: true, investigation: true},
  ts: Date = new Date()
): Thunk<Promise<void>> {
  return function(dispatch, getState) {
    dispatch(Notice.dismiss())
    const record = Search.getCurrentRecord(getState())
    const search = encodeSearchParams(record)
    const workspaceId = Current.getWorkspaceId()
    const spaceId = Current.getSpaceId()

    dispatch(SearchBar.submittingSearchBar(ts))
    dispatch(Tab.computeSpan(ts))

    if (!dispatch(SearchBar.validate())) return Promise.reject()

    const url = `/workspaces/${workspaceId}/lakes/${spaceId}/search?${search}`

    if (save.investigation) {
      dispatch(
        Investigation.push(workspaceId, spaceId, record, brim.time(ts).toTs())
      )
    }
    save.history ? global.tabHistory.push(url) : global.tabHistory.replace(url)
  }
}
