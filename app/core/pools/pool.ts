import {PoolConfig, PoolStats} from "@brimdata/zealot"
import brim, {Span} from "src/js/brim"

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

  defaultSpanArgs() {
    return this.everythingSpan()
  }

  hasStats() {
    return !!this.stats
  }

  hasSpan() {
    return this.hasStats() && this.stats.span !== null
  }

  empty() {
    if (this.stats && this.stats.span) return this.stats.span.dur === 0
    else return true
  }

  minTime(): Date {
    if (!this.stats) throw new Error("Pool has no stats")
    if (!this.stats.span) throw new Error("Pool has no span")
    return this.stats.span.ts
  }

  maxTime(): Date {
    if (!this.stats) throw new Error("Pool has no stats")
    if (!this.stats.span) throw new Error("Pool has no span")
    return new Date(this.minTime().getTime() + this.stats.span.dur)
  }

  everythingSpan(): Span {
    if (!this.stats.span) throw new Error("Pool has no span")
    if (!this.stats) throw new Error("No stats for this pool")
    return brim.span([this.minTime(), this.maxTime()]).toSpan()
  }
}
