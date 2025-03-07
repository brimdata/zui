import {isEqual} from "lodash"
import {PoolConfig, PoolStats, Ts} from "../../../../packages/superdb-types/dist"
import span from "src/js/models/span"

export class Pool {
  static from(opts: {data: PoolConfig; stats?: PoolStats}) {
    return new Pool(opts.data, opts.stats)
  }

  constructor(public data: PoolConfig, public stats?: PoolStats) {}

  get id() {
    return this.data.id
  }

  get name() {
    return this.data.name
  }

  get size() {
    if (this.stats) return this.stats.size
    else throw new Error("No stats for this pool")
  }

  get keys() {
    return this.data.layout.keys || []
  }

  defaultSpanArgs() {
    return this.everythingSpan()
  }

  hasStats() {
    return !!this.stats
  }

  hasSpan() {
    return this.hasStats() && this.stats.span !== null
  }

  hasTsKey() {
    return isEqual(this.keys, [["ts"]])
  }

  empty() {
    return this.size === 0
  }

  minTime(): Date {
    if (!this.stats) throw new Error("Pool has no stats")
    if (!this.stats.span) throw new Error("Pool has no span")
    const date = this.stats.span.ts
    if (isNaN(date.getTime())) throw new Error("Invalid Date")
    return date
  }

  maxTime(): Date {
    if (!this.stats) throw new Error("Pool has no stats")
    if (!this.stats.span) throw new Error("Pool has no span")
    const date = new Date(
      this.minTime().getTime() + Math.ceil(this.stats.span.dur / 1e6) + 1
    )
    if (isNaN(date.getTime())) throw new Error("Invalid Date")
    return date
  }

  everythingSpan(): [Ts, Ts] {
    if (!this.stats) throw new Error("No stats for this pool")
    if (!this.stats.span) throw new Error("Pool has no span")
    return span([this.minTime(), this.maxTime()]).toSpan()
  }
}
