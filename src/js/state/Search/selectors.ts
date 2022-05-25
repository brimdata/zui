import {poolSearchPath} from "src/app/router/utils/paths"
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

export const createHref = (state) => {
  const record = getRecord(state)
  const lakeId = Current.getLakeId(state)
  const poolId = Current.getPoolId(state)
  return poolSearchPath(poolId, lakeId, {...record})
}
