import brim from "./"
import {PoolStats} from "../../../zealot-old/types"
import {Pool} from "../state/Pools/types"

export default {
  poolStatsPayloadToPool(poolPayload: PoolStats): Partial<Pool> {
    if (!poolPayload) return null
    const {span, ...payload} = poolPayload
    const pool: Partial<Pool> = {...payload}
    if (span) {
      const span = poolPayload.span
      const start = brim.time(span.ts)
      const end = start.addTs(brim.time(span.dur).toTs())
      pool.min_time = start.toTs()
      pool.max_time = end.toTs()
    }
    return pool
  }
}
