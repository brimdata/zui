import {SearchRecord} from "../../types"
import Current from "../Current"
import SearchBar from "../SearchBar"
import Tab from "../Tab"
import {State} from "../types"

export const getRecord = (state: State): SearchRecord => {
  const pool = Current.mustGetPool(state)
  return {
    program: SearchBar.getSearchBar(state).current,
    pins: SearchBar.getSearchBar(state).pinned,
    spanArgs: Tab.getSpanArgs(state),
    poolName: pool.name,
    poolId: pool.id,
  }
}
