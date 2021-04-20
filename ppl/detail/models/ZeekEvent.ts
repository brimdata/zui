import {ZedRecord, ZedPrimitive} from "zealot/zed"
import {BrimEventInterface} from "./BrimEvent"

export class ZeekEvent implements BrimEventInterface {
  constructor(private r: ZedRecord) {}

  getRecord() {
    return this.r
  }

  getTime() {
    return (this.r.get("ts") as ZedPrimitive).toDate()
  }

  getEndTime() {
    if (this.r.get("_path").toString() !== "conn") return null
    const dur = (this.r.get("duration") as ZedPrimitive).toFloat()
    if (!dur) return
    const ts = (this.r.get("ts") as ZedPrimitive).toDate()
    return new Date(ts.getTime() + dur * 1000)
  }

  getType() {
    return this.r.get("_path").toString()
  }
}
