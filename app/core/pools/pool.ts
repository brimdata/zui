import {PoolConfig, PoolStats} from "@brimdata/zealot"
import brim, {Span} from "src/js/brim"

export class Pool {
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

  empty() {
    if (this.stats) return this.stats.span.dur === 0
    else return true
  }

  minTime(): Date {
    if (this.stats) return this.stats.span.ts
    else throw new Error("No stats for this pool")
  }

  maxTime(): Date {
    if (this.stats)
      return new Date(this.minTime().getTime() + this.stats.span.dur)
    else throw new Error("No stats for this pool")
  }

  everythingSpan(): Span {
    if (this.stats) return brim.span([this.minTime(), this.maxTime()]).toSpan()
    else throw new Error("No stats for this pool")
  }
}
