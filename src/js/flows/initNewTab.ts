import {syncPoolsData} from "app/core/pools/sync-pools-data"
import tabHistory from "app/router/tab-history"
import {lakePath} from "app/router/utils/paths"
import Current from "../state/Current"
import Tabs from "../state/Tabs"
import {Thunk} from "../state/types"

export default (): Thunk => (dispatch, getState) => {
  const state = getState()
  const pool = Current.getPool(state)
  const poolId = Current.getPoolId(state)
  const poolIsDeleted = poolId && !pool
  if (poolIsDeleted) dispatch(resetTab())
}

export function resetTab(): Thunk {
  return (dispatch, getState) => {
    const id = Current.getLakeId(getState())
    dispatch(Tabs.clearActive())
    dispatch(tabHistory.push(lakePath(id)))
    dispatch(syncPoolsData())
  }
}
