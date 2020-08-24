/* @flow */
import type {Thunk} from "../state/types"
import Last from "../state/Last"
import Search from "../state/Search"
import submitEventsSearch from "./submitEventsSearch"
import submitIndexSearch from "./submitIndexSearch"

export default function submitSearch(
  save: Object = {history: true, investigation: true},
  ts: Date = new Date()
): Thunk {
  return function(dispatch, getState) {
    const record = Search.getRecord(getState())
    dispatch(Last.setSearch(record))

    return dispatch(
      record.target === "index"
        ? submitIndexSearch(save, ts)
        : submitEventsSearch(save, ts)
    )
  }
}
