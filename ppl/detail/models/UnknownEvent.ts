import * as zed from "zealot/zed"
import {BrimEventInterface} from "./BrimEvent"

export class UnknownEvent implements BrimEventInterface {
  constructor(private r: zed.Record) {}

  getRecord() {
    return this.r
  }

  getTime() {
    if (this.r.has("ts")) {
      return (this.r.get("ts") as zed.Primitive).toDate()
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
