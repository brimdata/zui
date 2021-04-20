import {ZedRecord, ZedPrimitive} from "zealot/zed"
import {BrimEventInterface} from "./BrimEvent"

export class SuricataEvent implements BrimEventInterface {
  constructor(private r: ZedRecord) {}

  getRecord() {
    return this.r
  }

  getTime() {
    return (this.r.get("ts") as ZedPrimitive).toDate()
  }

  getEndTime() {
    return null
  }

  getType() {
    return this.r.get("event_type").toString()
  }

  getSeverity(): number {
    const data = this.r.get("alert.severity") as ZedPrimitive
    return data.toInt()
  }
}
