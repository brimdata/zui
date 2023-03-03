import {zed} from "@brimdata/zealot"
import {SecurityEventInterface} from "./security-event"

export class UnknownEvent implements SecurityEventInterface {
  constructor(private r: zed.Record) {}

  getRecord() {
    return this.r
  }

  getTime() {
    if (this.r.has("ts")) {
      return this.r.get<zed.Time>("ts").toDate()
    } else {
      return new Date(0)
    }
  }

  getEndTime() {
    return null
  }

  getType() {
    return "unknown"
  }
}
