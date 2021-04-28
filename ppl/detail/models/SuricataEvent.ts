import * as zed from "zealot/zed"
import {BrimEventInterface} from "./BrimEvent"

export class SuricataEvent implements BrimEventInterface {
  constructor(private r: zed.Record) {}

  getRecord() {
    return this.r
  }

  getTime() {
    return (this.r.get("ts") as zed.Primitive).toDate()
  }

  getEndTime() {
    return null
  }

  getType() {
    return this.r.get("event_type").toString()
  }

  getSeverity(): number {
    const data = this.r.get("alert.severity") as zed.Primitive
    return data.toInt()
  }
}
