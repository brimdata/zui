import brim from "./"

export default {
  poolPayloadToPool(pool: any) {
    if (pool.span) {
      const span = pool.span
      const start = brim.time(span.ts)
      const end = start.addTs(brim.time(span.dur).toTs())
      pool = {...pool, min_time: start.toTs(), max_time: end.toTs()}
      delete pool.span
    }
    return pool
  }
}
