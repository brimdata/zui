import span from "src/js/brim/span"
import {DateTuple} from "src/js/lib/TimeWindow"
import {Thunk} from "src/js/state/types"
import {ensurePoolLoaded} from "./ensure-pool-loaded"

export const getTimeRange =
  (poolName: string): Thunk<Promise<DateTuple>> =>
  async (dispatch) => {
    if (!poolName) return null
    const pool = await dispatch(ensurePoolLoaded(poolName))
    if (!pool) return null
    if (!pool.hasSpan()) return null
    return span(pool.everythingSpan()).toDateTuple()
  }
