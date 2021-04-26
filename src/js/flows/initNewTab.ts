import {Thunk} from "../state/types"
import Current from "../state/Current"
import Tabs from "../state/Tabs"
import refreshPoolNames from "./refreshPoolNames"
import {workspacePath} from "app/router/utils/paths"
import tabHistory from "app/router/tab-history"

export default (): Thunk => (dispatch, getState) => {
  const state = getState()
  const pool = Current.getPool(state)
  const poolId = Current.getPoolId(state)
  const poolIsDeleted = poolId && !pool
  if (poolIsDeleted) dispatch(resetTab())
}

export function resetTab(): Thunk {
  return (dispatch, getState) => {
    const id = Current.getWorkspaceId(getState())
    dispatch(Tabs.clearActive())
    dispatch(tabHistory.push(workspacePath(id)))
    dispatch(refreshPoolNames())
  }
}
