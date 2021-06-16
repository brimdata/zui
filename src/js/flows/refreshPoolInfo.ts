import {Thunk} from "../state/types"
import Current from "../state/Current"
import Pools from "../state/Pools"
import {getZealot} from "./getZealot"
import {Zealot} from "../../../zealot"
import {PoolConfig, PoolStats} from "../../../zealot/types"
import interop from "../brim/interop"

export default function refreshPoolInfo(): Thunk {
  return () => (dispatch, getState) => {
    const zealot: Zealot = dispatch(getZealot())
    const id = Current.getPoolId(getState())

    let config: PoolConfig
    let stats: PoolStats
    Promise.all([
      zealot.pools.get(id).then((data: PoolConfig) => {
        config = data
      }),
      zealot.pools.stats(id).then((data: PoolStats) => {
        stats = data
      })
    ]).then(() => {
      const id = Current.getWorkspaceId(getState())
      if (!id) return
      dispatch(
        Pools.setDetail(id, {
          ...config,
          ...interop.poolStatsPayloadToPool(stats)
        })
      )
    })
  }
}
