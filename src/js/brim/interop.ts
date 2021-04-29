import brim, {Ts} from "./"

export default {
  poolPayloadToPool(pool: any) {
    if (pool.span) {
      const span = pool.span
      const end = brim
        .time(span.ts)
        .addTs(span.dur as Ts)
        .toTs()
      pool = {...pool, min_time: span.ts, max_time: end}
      delete pool.span
    }
    return pool
  }
}
