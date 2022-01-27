import Current from "../state/Current"
import Pools from "../state/Pools"
import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"

// This code needs to be consolodated with refreshPoolInfo
export const initPool = (poolId: string): Thunk<Promise<void>> => (
  dispatch,
  getState
) => {
  const workspaceId = Current.getWorkspaceId(getState())
  if (!workspaceId) return
  const zealot = dispatch(getZealot())
  return Promise.all([zealot.getPool(poolId), zealot.getPoolStats(poolId)])
    .then(([data, stats]) => {
      dispatch(Pools.setDetail(workspaceId, {...data, ...stats} as any))
      console.log({...data, ...stats})
    })
    .catch((error) => {
      console.error(error)
    })
}
