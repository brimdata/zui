import {Thunk} from "../../state/types"
import {histogramSearch} from "../searches/histogramSearch"
import {saveToHistory} from "./save"
import {viewerSearch} from "../searches/viewerSearch"
import Last from "../../state/Last"
import Notice from "../../state/Notice"
import Search from "../../state/Search"
import SearchBar from "../../state/SearchBar"
import Tab from "../../state/Tab"
import Current from "../../state/Current"

type SaveOpts = {history: boolean; investigation: boolean}

export function submitSearch(
  save: SaveOpts = {history: true, investigation: true},
  ts: Date = new Date()
): Thunk<Promise<void>> {
  return function(dispatch, getState) {
    dispatch(Notice.dismiss())
    const record = Search.getCurrentRecord(getState())

    dispatch(SearchBar.submittingSearchBar(ts))
    dispatch(Tab.computeSpan(ts))

    const query = SearchBar.getSearchProgram(getState())
    const {type, chartProgram, tableProgram, span} = Search.getArgs(getState())
    const [from, to] = span

    if (record.target === "events") {
      if (!dispatch(SearchBar.validate())) return Promise.reject()
    }

    if (record.target === "index") {
      if (query === "*") return Promise.resolve()
    }

    const connId = Current.getConnectionId(getState())
    const spaceId = Current.getSpaceId(getState())
    dispatch(saveToHistory(connId, spaceId, record, save, ts))

    if (record.target === "index") {
      const promise = dispatch(viewerSearch({query, from, to, target: "index"}))
      dispatch(Last.setSearch(record))
      return promise
    } else {
      if (type === "events") {
        dispatch(histogramSearch({query: chartProgram, from, to}))
      }

      const promise = dispatch(
        viewerSearch({query: tableProgram, from, to, target: "events"})
      )
      dispatch(Last.setSearch(record))
      return promise
    }
  }
}
