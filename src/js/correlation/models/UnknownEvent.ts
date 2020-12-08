import {zng} from "../../../../zealot/dist"
import {BrimEventInterface} from "./BrimEvent"

export class UnknownEvent implements BrimEventInterface {
  constructor(private r: zng.Record) {}

  getTime() {
    if (this.r.has("ts")) {
      return (this.r.get("ts") as zng.Primitive).toDate()
    } else {
      return new Date(0)
    }
  }

  getType() {
    return "unknown"
  }
}
