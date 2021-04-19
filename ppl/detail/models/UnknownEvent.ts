import {ZedRecord, ZedPrimitive} from "zealot/zed/data-types"
import {BrimEventInterface} from "./BrimEvent"

export class UnknownEvent implements BrimEventInterface {
  constructor(private r: ZedRecord) {}

  getRecord() {
    return this.r
  }

  getTime() {
    if (this.r.has("ts")) {
      return (this.r.get("ts") as ZedPrimitive).toDate()
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
