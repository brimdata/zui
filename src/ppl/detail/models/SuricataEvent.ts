import {zed} from "@brimdata/zealot"
import {BrimEventInterface} from "./BrimEvent"

export class SuricataEvent implements BrimEventInterface {
  constructor(private r: zed.Record) {}

  getRecord() {
    return this.r
  }

  getTime() {
    return this.r.get<zed.Time>("ts").toDate()
  }

  getEndTime() {
    return null
  }

  getType() {
    return this.r.get("event_type").toString()
  }

  getSeverity(): number {
    return Number(this.r.get<zed.Uint64>(["alert", "severity"]).toInt())
  }
}
