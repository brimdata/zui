import {Thunk} from "../state/types"
import Current from "../state/Current"
import Pools from "../state/Pools"
import {getZealot} from "./getZealot"
import {Zealot} from "../../../zealot"
import {PoolConfig, PoolStats} from "../../../zealot/types"
import interop from "../brim/interop"
import Workspaces from "../state/Workspaces"
import workspace from "../brim/workspace"

type refreshPoolInfoArgs = {
  workspaceId: string
  poolId: string
}

export default function refreshPoolInfo(
  refreshPoolInfoArgs?: refreshPoolInfoArgs
): Thunk<Promise<void>> {
  return (dispatch, getState) => {
    const ws = refreshPoolInfoArgs?.workspaceId
      ? workspace(Workspaces.id(refreshPoolInfoArgs.workspaceId)(getState()))
      : Current.getWorkspace(getState())
    const zealot: Zealot = dispatch(getZealot(ws))
    const poolId = refreshPoolInfoArgs?.poolId || Current.getPoolId(getState())
    const workspaceId = ws.id

    let config: PoolConfig
    let stats: PoolStats
    return Promise.all([
      zealot.pools.get(poolId).then((data: PoolConfig) => {
        config = data
      }),
      zealot.pools.stats(poolId).then((data: PoolStats) => {
        stats = data
      })
    ]).then(() => {
      if (!workspaceId) return
      dispatch(
        Pools.setDetail(workspaceId, {
          ...config,
          ...interop.poolStatsPayloadToPool(stats)
        })
      )
    })
  }
}
