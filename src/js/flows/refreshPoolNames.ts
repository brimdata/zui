import {Thunk} from "../state/types"
import Current from "../state/Current"
import Pools from "../state/Pools"
import {getZealot} from "./getZealot"
import {BrimWorkspace} from "../brim"
import interop from "../brim/interop"

export default function refreshPoolNames(
  ws?: BrimWorkspace
): Thunk<Promise<void>> {
  return (dispatch, getState) => {
    const zealot = dispatch(getZealot(ws))

    let pools = []
    return zealot.pools
      .list()
      .then((data) => {
        pools = data || []
        return Promise.all(
          pools.map(async (pool, i) => {
            const stats = interop.poolStatsPayloadToPool(
              await zealot.pools.stats(pool.id)
            )
            pools[i] = {...pool, ...stats}
          })
        )
      })
      .then(() => {
        const id = ws?.id || Current.getWorkspaceId(getState())
        if (id) dispatch(Pools.setPools(id, pools))
      })
  }
}
