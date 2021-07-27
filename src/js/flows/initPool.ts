import interop from "../brim/interop"
import Current from "../state/Current"
import Pools from "../state/Pools"
import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"

export const initPool = (poolId: string): Thunk<Promise<void>> => (
  dispatch,
  getState
) => {
  const workspaceId = Current.getWorkspaceId(getState())
  if (!workspaceId) return
  const zealot = dispatch(getZealot())

  return Promise.all([zealot.pools.get(poolId), zealot.pools.stats(poolId)])
    .then(([data, rawStats]) => {
      const stats = interop.poolStatsPayloadToPool(rawStats)
      dispatch(Pools.setDetail(workspaceId, {...data, ...stats}))
    })
    .catch((error) => {
      console.error(error)
    })
}
