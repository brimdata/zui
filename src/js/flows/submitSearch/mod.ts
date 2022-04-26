import {featureIsEnabled} from "src/app/core/feature-flag"
import tabHistory from "src/app/router/tab-history"
import {poolSearchPath} from "src/app/router/utils/paths"
import brim from "src/js/brim"
import Investigation from "src/js/state/Investigation"
import Current from "../../state/Current"
import Notice from "../../state/Notice"
import Search from "../../state/Search"
import SearchBar from "../../state/SearchBar"
import Tab from "../../state/Tab"
import submitNewSearch from "src/app/query-home/flows/submit-search"

type SaveOpts = {history: boolean; investigation: boolean}

export function submitSearch(
  save: SaveOpts = {history: true, investigation: true},
  ts: Date = new Date()
) {
  if (featureIsEnabled("query-flow")) return submitNewSearch(save, ts)

  return function (dispatch, getState) {
    dispatch(Notice.dismiss())
    const record = Search.getRecord(getState())
    const lakeId = Current.getLakeId(getState())
    const poolId = Current.getPoolId(getState())

    dispatch(Tab.computeSpan(ts))

    if (!dispatch(SearchBar.validate())) return

    const url = poolSearchPath(poolId, lakeId, {...record})
    if (save.investigation) {
      dispatch(Investigation.push(lakeId, poolId, record, brim.time(ts).toTs()))
    }

    save.history
      ? dispatch(tabHistory.push(url))
      : dispatch(tabHistory.replace(url))
  }
}
