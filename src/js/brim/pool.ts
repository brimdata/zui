import {isNumber} from "../lib/is"
import {Pool} from "../state/Pools/types"

type PartialPool = {
  name: string
  id: string
}
class BrimPool {
  constructor(public info: Pool | PartialPool) {}

  get id() {
    return this.info.id
  }

  get name() {
    return this.info.name
  }

  get size() {
    if ("size" in this.info) return this.info.size
    else throw new Error("No pool stats yet")
  }

  defaultSpanArgs() {
    return this.everythingSpan()
  }
  hasStats() {
    return "size" in this.info
  }
  empty() {
    if ("span" in this.info) return this.info.span.dur === 0
    else return true
  }
  minTs(): Date {
    if ("span" in this.info) return this.info.span.ts
    else throw new Error("No pool stats yet")
  }
  maxTs(): Date {
    if ("span" in this.info)
      return new Date(this.minTs().getTime() + this.info.span.dur)
    else throw new Error("No pool stats yet")
  }
  everythingSpan(): [Date, Date] {
    if ("span" in this.info) return [this.minTs(), this.maxTs()]
    else throw new Error("No pool stats yet")
  }
  ingesting() {
    if (!("ingest" in this.info)) return false
    return isNumber(this.info.ingest.progress)
  }
  ingestProgress() {
    if (!("ingest" in this.info)) return 0
    return isNumber(this.info.ingest.progress) ? this.info.ingest.progress : 0
  }
  queryable() {
    return !(this.ingesting() && this.empty())
  }
}

export default function pool(info: Pool) {
  return new BrimPool(info)
}
