import Current from "src/js/state/Current"
import Notice from "src/js/state/Notice"
import SearchBar from "src/js/state/SearchBar"
import {updateQuery} from "./update-query"
import initialViewerSearch from "./initial-viewer-search"

type SaveOpts = {history: boolean; investigation: boolean}

const submitSearch = (
  _save: SaveOpts = {history: true, investigation: true},
  _ts: Date = new Date()
) => async (dispatch, getState) => {
  dispatch(Notice.dismiss())
  // TODO: Mason - set filter pins here too?
  const input = SearchBar.getSearchBarInputValue(getState())
  const query = Current.getQuery(getState())
  query.value = input
  await dispatch(updateQuery(query))
  if (!dispatch(SearchBar.validate())) return
  // TODO: Mason - refactor history to use query copies
  // if (save.investigation) {
  //   dispatch(Investigation.push(lakeId, poolId, record, brim.time(ts).toTs()))
  // }
  dispatch(initialViewerSearch())
}

export default submitSearch
