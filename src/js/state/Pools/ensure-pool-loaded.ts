import {Pool} from "src/app/core/pools/pool"
import {syncPool} from "src/app/core/pools/sync-pool"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import {Thunk} from "src/js/state/types"

export const ensurePoolLoaded =
  (name: string): Thunk<Promise<Pool>> =>
  (dispatch, getState) => {
    const lakeId = Current.getLakeId(getState())
    const pool = Pools.getByName(lakeId, name)(getState())
    if (!pool) return Promise.resolve(null)
    if (pool.hasStats()) {
      return Promise.resolve(pool)
    } else {
      return dispatch(syncPool(pool.id, lakeId))
    }
  }
