import {Thunk} from "../state/types"
import Current from "../state/Current"
import Pools from "../state/Pools"
import {getZealot} from "./getZealot"

export default function refreshPoolNames(): Thunk<Promise<void>> {
  return (dispatch, getState) => {
    const zealot = dispatch(getZealot())
    let pools = []
    return zealot.pools
      .list()
      .then((data) => {
        pools = data || []
        return Promise.all(
          pools.map(async (pool, i) => {
            let stats = await zealot.pools.stats(pool.id)
            pools[i] = {...pool, ...stats}
          })
        )
      })
      .then(() => {
        const id = Current.getWorkspaceId(getState())
        if (id) dispatch(Pools.setPools(id, pools))
      })
  }
}
