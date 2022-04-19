import Current from "src/js/state/Current"
import Notice from "src/js/state/Notice"
import SearchBar from "src/js/state/SearchBar"
import initialViewerSearch from "./initial-viewer-search"
import {newQueryVersion} from "./new-query-version"

type SaveOpts = {history: boolean; investigation: boolean}

const submitSearch =
  (
    _save: SaveOpts = {history: true, investigation: true},
    _ts: Date = new Date()
  ) =>
  (dispatch, getState) => {
    dispatch(Notice.dismiss())

    const input = SearchBar.getSearchBarInputValue(getState())

    const query = Current.getQuery(getState())
    // TODO: Lets add a diff check here comparing latest version to current searchBar values.
    // if they are the same then we don't need to create a new version, just activate it
    dispatch(
      newQueryVersion(query.id, {...query.currentVersion(), value: input})
    ).then((_version) => {
      if (!dispatch(SearchBar.validate())) return
      // TODO: Mason - refactor history to store copy of {...query.serialize(), ...version}
      // if (save.investigation) {
      //   dispatch(Investigation.push(lakeId, poolId, record, brim.time(ts).toTs()))
      // }
      dispatch(initialViewerSearch())
    })
  }

export default submitSearch
