import {Client, PoolConfig, PoolStats} from "@brimdata/zealot"
import workspace from "../brim/workspace"
import Current from "../state/Current"
import Lakes from "../state/Lakes"
import Pools from "../state/Pools"
import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"

type refreshPoolInfoArgs = {
  workspaceId: string
  poolId: string
}

// Merge this with initPool.ts
export default function refreshPoolInfo(
  refreshPoolInfoArgs?: refreshPoolInfoArgs
): Thunk<Promise<void>> {
  return (dispatch, getState) => {
    const ws = refreshPoolInfoArgs?.workspaceId
      ? workspace(Lakes.id(refreshPoolInfoArgs.workspaceId)(getState()))
      : Current.getWorkspace(getState())
    const zealot: Client = dispatch(getZealot(ws))
    const poolId = refreshPoolInfoArgs?.poolId || Current.getPoolId(getState())
    const workspaceId = ws.id

    let config: any
    let stats: any
    return Promise.all([
      zealot.getPool(poolId).then((data: PoolConfig) => {
        config = data
      }),
      zealot.getPoolStats(poolId).then((data: PoolStats) => {
        stats = data
      })
    ]).then(() => {
      if (!workspaceId) return
      dispatch(
        Pools.setDetail(workspaceId, {
          ...config,
          ...stats
        })
      )
    })
  }
}
