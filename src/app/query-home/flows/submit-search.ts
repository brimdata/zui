import tabHistory from "src/app/router/tab-history"
import {lakeQueryPath} from "src/app/router/utils/paths"
import Current from "src/js/state/Current"
import Notice from "src/js/state/Notice"
import SearchBar from "src/js/state/SearchBar"
import {getQuerySource} from "./get-query-source"
import {updateQuery} from "./update-query"

type SaveOpts = {history: boolean; investigation: boolean}

const submitSearch = (
  save: SaveOpts = {history: true, investigation: true},
  _ts: Date = new Date()
) => async (dispatch, getState) => {
  dispatch(Notice.dismiss())
  // TODO: Mason - set filter pins here too?
  const input = SearchBar.getSearchBarInputValue(getState())
  const query = Current.getQuery(getState())
  query.value = input
  await dispatch(updateQuery(query))
  const lakeId = Current.getLakeId(getState())
  const source = dispatch(getQuerySource(query.id))
  if (!dispatch(SearchBar.validate())) return

  const url = lakeQueryPath(query.id, lakeId, {isDraft: source === "draft"})

  // TODO: Mason - refactor history to use query copies
  // if (save.investigation) {
  //   dispatch(Investigation.push(lakeId, poolId, record, brim.time(ts).toTs()))
  // }

  save.history
    ? dispatch(tabHistory.push(url))
    : dispatch(tabHistory.replace(url))
}

export default submitSearch
