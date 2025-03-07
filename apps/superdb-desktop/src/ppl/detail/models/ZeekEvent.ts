import * as zed from "../../../../../../packages/superdb-types/dist"
import {SecurityEventInterface} from "./security-event"
import {isNumber} from "lodash"

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
    const dur = this.r.get<zed.Duration>("duration").asMs()
    if (!isNumber(dur)) return
    const ts = this.r.get<zed.Time>("ts").toDate()
    return new Date(ts.getTime() + dur)
  }

  getType() {
    return this.r.get("_path").toString()
  }
}
