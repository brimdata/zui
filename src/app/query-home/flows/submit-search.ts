import Current from "src/js/state/Current"
import Notice from "src/js/state/Notice"
import Results from "src/js/state/Results"
import SearchBar from "src/js/state/SearchBar"
import Tabs from "src/js/state/Tabs"
import {updateQuery} from "./update-query"

type SaveOpts = {history: boolean; investigation: boolean}

const submitSearch =
  (
    _save: SaveOpts = {history: true, investigation: true},
    _ts: Date = new Date()
  ) =>
  async (dispatch, getState) => {
    dispatch(Notice.dismiss())
    const input = SearchBar.getSearchBarInputValue(getState())
    const query = Current.getQuery(getState())
    query.value = input
    await dispatch(updateQuery(query))
    if (!dispatch(SearchBar.validate())) return
    // TODO: Mason - refactor history to use query copies
    // if (save.investigation) {
    //   dispatch(Investigation.push(lakeId, poolId, record, brim.time(ts).toTs()))
    // }
    const key = Current.getLocation(getState()).key
    const tabId = Tabs.getActive(getState())
    dispatch(Results.fetchFirstPage(query.format(), key, tabId))
  }

export default submitSearch
