import {isNumber} from "../lib/is"
import {Pool} from "../state/Pools/types"
import brim, {Span} from "./"

export default function pool(info: Pool) {
  return {
    ...info,
    isArchive() {
      return this.getType() === "archive"
    },
    defaultSpanArgs() {
      return this.everythingSpan()
    },
    empty() {
      if (!info.min_time || !info.max_time) return true
      return (
        info.min_time.sec === 0 &&
        info.min_time.ns === 0 &&
        info.max_time.sec === 0 &&
        info.max_time.ns === 0
      )
    },
    minTs() {
      return info.min_time
    },
    maxTs() {
      return info.max_time
    },
    everythingSpan(): Span {
      const {min_time, max_time} = info
      const from = brim.time(min_time).toTs()
      const to = brim
        .time(max_time)
        .add(1, "ms")
        .toTs()
      return [from, to]
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
