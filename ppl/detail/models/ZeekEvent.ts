import * as zed from "zealot/zed"
import {BrimEventInterface} from "./BrimEvent"

export class ZeekEvent implements BrimEventInterface {
  constructor(private r: zed.Record) {}

  getRecord() {
    return this.r
  }

  getTime() {
    return (this.r.get("ts") as zed.Primitive).toDate()
  }

  getEndTime() {
    if (this.r.get("_path").toString() !== "conn") return null
    const dur = (this.r.get("duration") as zed.Primitive).toFloat()
    if (!dur) return
    const ts = (this.r.get("ts") as zed.Primitive).toDate()
    return new Date(ts.getTime() + dur * 1000)
  }

  getType() {
    return this.r.get("_path").toString()
  }
}
