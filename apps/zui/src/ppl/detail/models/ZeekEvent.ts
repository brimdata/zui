import * as zed from "@brimdata/zed-js"
import {SecurityEventInterface} from "./security-event"

export class ZeekEvent implements SecurityEventInterface {
  constructor(private r: zed.Record) {}

  getRecord() {
    return this.r
  }

  getTime() {
    return this.r.get<zed.Time>("ts").toDate()
  }

  getEndTime() {
    if (this.r.get("_path").toString() !== "conn") return null
    const dur = this.r.get<zed.Duration>("duration").asSeconds()
    if (!dur) return
    const ts = this.r.get<zed.Time>("ts").toDate()
    return new Date(ts.getTime() + dur * 1000)
  }

  getType() {
    return this.r.get("_path").toString()
  }
}
