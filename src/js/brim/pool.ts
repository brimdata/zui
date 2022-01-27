import {isNumber} from "../lib/is"
import {Pool} from "../state/Pools/types"
import {Span} from "./"

export default function pool(info: Pool) {
  return {
    ...info,
    defaultSpanArgs() {
      return this.everythingSpan()
    },
    hasStats() {
      return info.size !== undefined
    },
    empty() {
      return info.span.dur === 0
    },
    minTs(): Date {
      return info.span.ts
    },
    maxTs(): Date {
      return new Date(this.minTs + info.span.dur)
    },
    everythingSpan(): Span {
      return [this.minTs(), this.maxTs()]
    },
    ingesting() {
      return isNumber(info.ingest.progress)
    },
    ingestProgress() {
      return isNumber(info.ingest.progress) ? info.ingest.progress : 0
    },
    queryable() {
      return !(this.ingesting() && this.empty())
    }
  }
}
